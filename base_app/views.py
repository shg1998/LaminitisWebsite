from django.shortcuts import render


def home(request):
    return render(request, 'base_app/home.html')


def about(request):
    return render(request, 'base_app/about.html', {'name': 'About'})

