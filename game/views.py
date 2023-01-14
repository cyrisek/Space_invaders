from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Score


# Create your views here.


def index(request):
    # getting top 5 scores
    scores = Score.objects.all().order_by('-number')[:5]
    return render(request, 'index.html', {
        "scores": scores,
    })


@csrf_exempt
def new_score(request):
    # Saving new score
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    name = data.get("name", "")
    number = data.get("number", "")
    print(name)
    print(number)
    if number <= 0:
        return JsonResponse({"error": "Score have to be more than 0."}, status=400)
    results = Score(
        name=name,
        number=number,
    )
    results.save()
    return JsonResponse({"message": "Score saved successfully."}, status=201)
