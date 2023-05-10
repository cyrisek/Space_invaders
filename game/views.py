from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView
import json
from .models import Score


# Create your views here.


class IndexView(ListView):
    model = Score
    queryset = Score.objects.all().order_by('-number')[:5]
    template_name = 'index.html'
    context_object_name = 'scores'


@csrf_exempt
def new_score(request):
    # Saving new score
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."})
    data = json.loads(request.body)
    name = data.get("name", "")
    number = data.get("number", "")
    if number <= 0:
        return JsonResponse({"error": "Score must be more than 0."})
    elif name == "":
        return JsonResponse({"error": "Name is required."})
    results = Score(
        name=name,
        number=number,
    )
    results.save()
    return JsonResponse({"message": "Score saved successfully."}, status=201)
