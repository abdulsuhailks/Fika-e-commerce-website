"""
URL configuration for fika_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from fikaapp.views import *

from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('admin/', admin.site.urls),
    path('register', register, name='register'),
    path('logins', logins, name='logins'),
    path('addproduct', addproduct, name='addproduct'),
    path('viewproduct', getproducts, name='viewproduct'),
    path('editproduct/<int:id>', edit_product, name='editproduct'),
    path('updateproduct/<int:id>', update_product, name='update_product'),
    path('deleteproduct/<int:id>',delete_product, name='deleteproduct'),
    path('one_product_per_category', one_product_per_category, name='one_product_per_category'), 
    path('products_by_category/<str:category>', products_by_category, name='products_by_category'),
    path('search/', search_products, name='search_products'),
    path('product/<int:id>', product, name='product'),
    path('add_to_cart', add_to_cart, name='add_to_cart'),
    path('view_cart/<int:user_id>/', get_cart_items, name='get_cart_items'),
    path('delete_cart_item/<int:id>',delete_cart_item, name='delete_cart_item'),
    path('update_cart_item/<int:cart_id>/', update_cart_item, name='update_cart_item'),
    path('add_address/', add_address, name='add_address'),
    path('get_address/<int:user_id>/', get_address, name='get_address'),
    path('place_order/', place_order, name='place_order'),
    path('place_bulk_order/', place_bulk_order, name='place_bulk_order'),
    path('edit_profile/<int:id>', edit_profile, name='edit_profile'),
    path('update_profile/<int:id>', update_profile, name='update_profile'),
    path('get_orders/<int:user_id>/', get_user_orders, name='get_user_orders'),
    path('cancel_order/<int:order_id>/', cancel_order, name='cancel_order'),
    path('deliver_order/<int:order_id>/', deliver_order, name='deliver_order'),
    path('delete_address/<int:user_id>/<int:address_id>/', delete_address, name='delete_address'),
    path('api/create-payment/', create_payment, name='create_payment'),
    path('api/payment-success/', payment_success, name='payment_success'),
    path('sold_products/', sold_products, name='sold_products'),
    # path('check_product_in_cart/',check_product_in_cart, name='check_product_in_cart'),

    



    # path('logout', logout, name='logout'),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
