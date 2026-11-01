
from rest_framework import serializers
from .models import User
from .models import Product
from .models import Cart
from .models import OrderAddress
from .models import Order



class Personserialzer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'



class CartSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    description = serializers.CharField(source='product.description', read_only=True)
    stock = serializers.IntegerField(source='product.stock', read_only=True)
    size = serializers.CharField(source='product.size', read_only=True)
    image = serializers.ImageField(source='product.image', read_only=True)
    class Meta:
        model = Cart
        fields = '__all__'
        # fields = ['user', 'product',  'price','quantity', 'user_name', 'product_name','image', 'description', 'stock']



class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAddress
        fields = '__all__'




# class OrderSerializer(serializers.ModelSerializer):
#     product_name = serializers.CharField(source='product.name', read_only=True)
#     image = serializers.ImageField(source='product.image', read_only=True)
#     description = serializers.CharField(source='product.description', read_only=True)
#     shipping_address = OrderAddressSerializer(read_only=True)
#     shipping_address = serializers.IntegerField(source='shipping_address.address_line', read_only=True)


#     class Meta:
#         model = Order
#         fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    image = serializers.ImageField(source='product.image', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    address = serializers.CharField(source='shipping_address.full_address', read_only=True)

    description = serializers.CharField(source='product.description', read_only=True)
    shipping_address = OrderAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class SoldProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    image = serializers.ImageField(source='product.image', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    description = serializers.CharField(source='product.description', read_only=True)

    address = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id','product_name','image','description','quantity','price','username','address','order_date', 'status']

    def get_address(self, obj):
        if obj.shipping_address:
            a = obj.shipping_address
            return f"{a.address_line}, {a.city}, {a.state}, {a.postal_code}, {a.country}"
        return ""
