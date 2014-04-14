from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def home(request):
	return HttpResponse("<h1>lookee I'm a website!</h1>Check out my friend's <a href='jamesreinke.com'>inferior website</a>")