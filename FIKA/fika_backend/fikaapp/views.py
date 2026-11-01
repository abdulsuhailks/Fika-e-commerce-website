

from django.shortcuts import render
from django.db.models import Q

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

import razorpay
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import Personserialzer
from django.contrib.auth import get_user_model
User = get_user_model()


from .serializers import ProductSerializer
from .serializers import CartSerializer
from .serializers import OrderAddressSerializer
from .serializers import OrderSerializer
from .serializers import SoldProductSerializer

from .models import Product
from .models import Cart
from .models import User
from .models import OrderAddress
from .models import Order



# Create your views here.

@api_view(['post'])
def register(request):
    data=request.data
    data['password']=make_password(data['password'])
    serializer = Personserialzer(data=request.data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)

@api_view(['POST'])
def logins(request):
    data = request.data

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)

        message = "Admin Login successful" if user.is_superuser else "User Login successful"
        return Response({
            'token': token.key,
            'user_id': user.id,
            'message': message
        }, status=200)
    else:
        return Response({'error': 'Invalid Credentials'}, status=400)



@api_view(['post'])
def logouts(request):
    logout(request)
    return Response({"message": "Logout successful"})


@api_view(['post'])
def addproduct(request):
    data = request.data
    serializer = ProductSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return Response(serializer.errors, status=400)
    

@api_view(['get'])
def getproducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def edit_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)


@api_view(['PUT'])
def update_product(request, id):
    try:
        product = Product.objects.get(id=id)
        print(product,'product')
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    print(request.data)
    serializer = ProductSerializer(product, data=request.data, partial=True) 
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)



@api_view(['DELETE'])
def delete_product(request, id):
    try:
        product = Product.objects.get(id=id)
        product.delete()
        return Response({'message': 'Product deleted successfully!'})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)


# @api_view(['GET'])
# def one_product_per_category(request):
#     products = Product.objects.order_by('category', 'id')  
#     unique = {}
#     result = []
#     for product in products:
#         if product.category not in unique:
#             unique[product.category] = True
#             result.append(product)
#             print(product.category, 'category')
#             print(result, 'result')
#     serializer = ProductSerializer(result, many=True)
#     return Response(serializer.data)


import random
from collections import defaultdict

@api_view(['GET'])
def one_product_per_category(request):
    products = Product.objects.all()
    grouped = defaultdict(list)

    for product in products:
        grouped[product.category].append(product)

    result = []

    for category, items in grouped.items():
        random_product = random.choice(items)
        result.append(random_product)

    serializer = ProductSerializer(result, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def products_by_category(request, category):
    print(category,'category')
    print(request.method)
    try:
        products = Product.objects.filter(category=category)
        serializer = ProductSerializer(products, many=True)
        print(serializer.data)
        return Response({'products': serializer.data})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['GET'])
def get_product_by_id(request, id):
    try:
        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('query', '')

    if query:
        products = Product.objects.filter(
            name__icontains=query
        ) | Product.objects.filter(
            description__icontains=query
        ) | Product.objects.filter(
            category__icontains=query
        )
    else:
        products = Product.objects.none()  

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def product(request, id):
    # print(id, 'id')
    try:
        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product)
        # print(serializer.data, 'serializer data')
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)




@api_view(['POST'])
def add_to_cart(request):
    print(request.data, 'request data')
    
    user_id = request.data.get('user_id')
    product_id = request.data.get('product_id')
    price = request.data.get('price')
    quantity = request.data.get('quantity', 1)  
    print(user_id,product_id,price,quantity)
    if not user_id or not product_id or not price:
        return Response({'error': 'User ID, Product ID, and Price are required'}, status=400)
    
    try:
        user = User.objects.get(id=user_id)
        print(user, 'user')
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    try:
        product = Product.objects.get(id=product_id)
        print(product, 'product')
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    try:
        price = float(price)
        quantity = int(quantity)
        print(price, quantity, 'price and quantity')
        if quantity <= 0 or price < 0:
            return Response({'error': 'Invalid quantity or price'}, status=400)
    except ValueError:
        return Response({'error': 'Price and quantity must be valid numbers'}, status=400)


    existing_item = Cart.objects.filter(user=user, product=product).first()
    print(existing_item, 'existing item')
    if existing_item:
        existing_item.quantity += quantity
        existing_item.price = price  # Update price if needed
        existing_item.save()
        serializer = CartSerializer(existing_item)
        print(serializer.data, 'serializer data')
        return Response(serializer.data, status=200)

    cart_item = Cart.objects.create(user=user, product=product, price=price, quantity=quantity)
    serializer = CartSerializer(cart_item)
    print(serializer.data, 'serializer data')
    response_data = serializer.data
    response_data['user_name'] = user.username
    response_data['product_name'] = product.name
    print(response_data, 'response data')
    return Response(response_data, status=201)



@api_view(['GET'])
def get_cart_items(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        cart_items = Cart.objects.filter(user=user)

        print(cart_items, 'cart items')
        serializer = CartSerializer(cart_items, many=True)
        print(serializer.data, 'serializer data')
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    

@api_view(['DELETE'])
def delete_cart_item(request, id):
    try:
        cart_item = Cart.objects.get(id=id)
        cart_item.delete()
        return Response({'message': 'Cart item deleted successfully!'})
    except Cart.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)


@api_view(['PUT'])
def update_cart_item(request, cart_id):
    """Update quantity of a cart item. Accepts either {'quantity': n} to set absolute quantity
    or {'delta': 1} / {'delta': -1} to increment/decrement. If resulting quantity <= 0 the item is deleted."""
    try:
        cart_item = Cart.objects.get(id=cart_id)
        data = request.data

        if 'delta' in data:
            try:
                delta = int(data.get('delta'))
            except (TypeError, ValueError):
                return Response({'error': 'Invalid delta value'}, status=400)
            new_qty = cart_item.quantity + delta
        elif 'quantity' in data:
            try:
                new_qty = int(data.get('quantity'))
            except (TypeError, ValueError):
                return Response({'error': 'Invalid quantity value'}, status=400)
        else:
            return Response({'error': 'No quantity or delta provided'}, status=400)

        if new_qty <= 0:
            cart_item.delete()
            return Response({'message': 'Cart item removed', 'deleted': True})

        cart_item.quantity = new_qty
        cart_item.save()
        serializer = CartSerializer(cart_item)
        return Response(serializer.data)

    except Cart.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
def add_address(request):
    serializer = OrderAddressSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_address(request, user_id):
    addresses = OrderAddress.objects.filter(user_id=user_id)
    if not addresses.exists():
        return Response({'error': 'No addresses found for this user'}, status=404)
    
    serializer = OrderAddressSerializer(addresses, many=True)
    return Response(serializer.data)


# @api_view(['POST'])
# def place_order(request):
#     print('....',request)
#     try:
#         user_id = request.data.get('user_id')
#         product_id = request.data.get('product_id')
#         address_id = request.data.get('address_id')
#         quantity = int(request.data.get('quantity'))
#         price = float(request.data.get('price'))
#         data = request.data

#         # If Angular sent a list, extract the first object
#         if isinstance(data, list):
#             data = data[0]

#         user_id = data.get('user_id')
#         product_id = data.get('product_id')
#         address_id = data.get('address_id')
#         quantity = int(data.get('quantity'))
#         price = float(data.get('price'))

#         print('/////',price)

#         if not all([user_id, product_id, address_id, quantity, price]):
#             return Response({'error': 'Missing required fields'}, status=400)

#         user = User.objects.get(id=user_id)
#         product = Product.objects.get(id=product_id)
#         address = OrderAddress.objects.get(id=address_id)

#         total_price = price * quantity

#         order = Order.objects.create(
#             user=user,
#             product=product,
#             shipping_address=address,
#             quantity=quantity,
#             price=price,
#             total_price=total_price,
#             status='Pending'  # Default, can be changed later
#         )

#         serializer = OrderSerializer(order)
#         return Response({'message': 'Order placed successfully', 'order': serializer.data}, status=201)

#     except User.DoesNotExist:
#         return Response({'error': 'User not found'}, status=404)
#     except Product.DoesNotExist:
#         return Response({'error': 'Product not found'}, status=404)
#     except OrderAddress.DoesNotExist:
#         return Response({'error': 'Address not found'}, status=404)
#     except Exception as e:
#         return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def place_order(request):
    print('....', request)
    try:
        data = request.data

        if isinstance(data, list):
            data = data[0]

        user_id = data.get('user_id')
        product_id = data.get('product_id')
        address_id = data.get('address_id')
        quantity = int(data.get('quantity'))
        price = float(data.get('price'))

        print('/////', price)

        if not all([user_id, product_id, address_id, quantity, price]):
            return Response({'error': 'Missing required fields'}, status=400)

        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)
        address = OrderAddress.objects.get(id=address_id)

        if product.stock < quantity:
            return Response({
                'error': 'Not enough stock available',
                'available_stock': product.stock
            }, status=400)

        total_price = price * quantity


        order = Order.objects.create(
            user=user,
            product=product,
            shipping_address=address,
            quantity=quantity,
            price=price,
            total_price=total_price,
            status='Pending'
        )

        product.stock -= quantity
        product.save()

        try:
            cart_item = Cart.objects.get(user=user, product=product)
            cart_item.delete()
        except Cart.DoesNotExist:
            pass

        serializer = OrderSerializer(order)
        return Response({
            'message': 'Order placed successfully',
            'order': serializer.data
        }, status=201)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    except OrderAddress.DoesNotExist:
        return Response({'error': 'Address not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['PUT'])
def deliver_order(request, order_id):
    """Mark an order as dispatched/delivered. Intended for admin use."""
    try:
        order = Order.objects.get(id=order_id)
        if order.status == 'Dispatched' or order.status == 'Delivered':
            return Response({'error': 'Order is already dispatched/delivered'}, status=400)

        order.status = 'Dispatched'
        order.save()
        serializer = OrderSerializer(order)
        return Response({'message': 'Order marked as dispatched', 'order': serializer.data}, status=200)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def place_bulk_order(request):
    print('Bulk order request:', request.data)
    try:
        data = request.data
        user_id = data.get('user_id')
        address_id = data.get('address_id')
        items = data.get('items', [])

        if not all([user_id, address_id, items]):
            return Response({'error': 'Missing required fields'}, status=400)

        if not isinstance(items, list) or len(items) == 0:
            return Response({'error': 'Items must be a non-empty list'}, status=400)

        user = User.objects.get(id=user_id)
        address = OrderAddress.objects.get(id=address_id)

        orders = []
        total_price = 0
        errors = []

        for item in items:
            try:
                product_id = item.get('product_id')
                price = float(item.get('price'))
                quantity = int(item.get('quantity'))

                if not all([product_id, price, quantity]):
                    errors.append(f"Missing fields for item {product_id}")
                    continue

                product = Product.objects.get(id=product_id)

                if product.stock < quantity:
                    errors.append(f"Not enough stock for {product.name}. Available: {product.stock}")
                    continue

                item_total = price * quantity
                total_price += item_total

                order = Order.objects.create(
                    user=user,
                    product=product,
                    shipping_address=address,
                    quantity=quantity,
                    price=price,
                    total_price=item_total,
                    status='Pending'
                )

                product.stock -= quantity
                product.save()

                try:
                    cart_item = Cart.objects.get(user=user, product=product)
                    cart_item.delete()
                except Cart.DoesNotExist:
                    pass

                orders.append(order)

            except Product.DoesNotExist:
                errors.append(f"Product {product_id} not found")
                continue
            except Exception as e:
                errors.append(f"Error processing item {product_id}: {str(e)}")
                continue

        if len(orders) == 0:
            return Response({'error': 'No orders could be created. Errors: ' + ', '.join(errors)}, status=400)

        serializer = OrderSerializer(orders, many=True)
        return Response({
            'message': 'Bulk orders placed successfully',
            'orders': serializer.data,
            'total_price': total_price,
            'order_count': len(orders),
            'errors': errors if errors else None
        }, status=201)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except OrderAddress.DoesNotExist:
        return Response({'error': 'Address not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)



@api_view(['GET'])
def edit_profile(request, id):
    try:
        user = User.objects.get(id=id)
    except user.DoesNotExist:
        return Response({'error': 'user not found'}, status=404)

    if request.method == 'GET':
        serializer = Personserialzer(user)
        return Response(serializer.data)
    

@api_view(['PUT'])
def update_profile(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    serializer = Personserialzer(user, data=request.data, partial=True) 
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_user_orders(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        orders = Order.objects.filter(user=user).order_by('-order_date')  # Latest first
        serializer = OrderSerializer(orders, many=True)
        return Response({'orders': serializer.data}, status=200)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['DELETE'])
def delete_address(request, user_id, address_id):
    try:
        address = OrderAddress.objects.get(id=address_id, user_id=user_id)
        address.delete()
        return Response({'message': 'Address deleted successfully!'})
    except OrderAddress.DoesNotExist:
        return Response({'error': 'Address not found'}, status=404)

@api_view(['PUT'])
def cancel_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        if order.status == 'Cancelled':
            return Response({'error': 'Order is already cancelled'}, status=400)

        # Restore product stock
        try:
            product = order.product
            product.stock = product.stock + order.quantity
            product.save()
        except Exception as e:
            # If stock restore fails, log and continue to mark the order cancelled
            print(f"Failed to restore stock for order {order_id}: {e}")

        order.status = 'Cancelled'
        order.save()
        serializer = OrderSerializer(order)
        return Response({'message': 'Order cancelled successfully', 'order': serializer.data}, status=200)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    


@api_view(['POST'])
def create_payment(request):
    print(request.data,"///////////////////////////////")
    data = request.data
    name = data.get('name')
    email = data.get('email')
    amount = int(data.get('amount')) * 100  

    client = razorpay.Client(auth=("rzp_test_ifqXZb84qSL1CP", "IwSyyaBvXh300nlqM0kqb0ow"))
    payment = client.order.create({'amount': amount, 'currency': 'INR', 'payment_capture': '1'})

    return Response({
        "order_id": payment['id'],
        "amount": amount,
        "currency": "INR",
        "key": "rzp_test_ifqXZb84qSL1CP",
        "name": name,
        "email": email
    })

@api_view(['POST'])
def payment_success(request):
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    order_id = request.data.get('order_id')

    try:
        order = Order.objects.get(id=order_id)
        order.status = 'Paid'  
        order.save()

        return Response({
        'message': 'Payment recorded and order updated.',
        'status': order.status 
})

    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=404)



@api_view(['GET'])
def sold_products(request):
    try:
        orders = Order.objects.select_related(
            'product', 'user', 'shipping_address'
        ).order_by('-order_date')

        serializer = SoldProductSerializer(orders, many=True)
        print(serializer.data, 'sold products serializer data')
        return Response({'orders': serializer.data}, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


