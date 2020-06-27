from django.urls import path
from base_app.views import home, about
from base_app.webservice import getImage, getPoints, setPoints

urlpatterns = [
    path('', home, name='base-home'),
    path('about/', about, name='base-about'),

    # webservice
    path('webservice/getImage/<int:patient_id>/<int:image_id>/', getImage, name='webservice-getImage'),
    path('webservice/getPoints/<int:patient_id>/<int:image_id>/', getPoints, name='webservice-getPoints'),
    path('webservice/setPoints/<int:patient_id>/<int:image_id>/', setPoints, name='webservice-setPoints'),
]