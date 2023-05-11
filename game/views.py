from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.edit import FormMixin
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView
import json
from .models import Score
from .forms import ScoreForm

# Create your views here.


class IndexView(FormMixin, ListView):
    model = Score
    queryset = Score.objects.all().order_by('-number')[:5]
    template_name = 'index.html'
    context_object_name = 'scores'
    form_class = ScoreForm


# @csrf_exempt
def new_score(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."})

    data = json.loads(request.body)
    form = ScoreForm(data=data)

    if form.is_valid():
        form.save()
        return JsonResponse({"message": "Score saved successfully."})
    else:
        errors = {}
        for field, error_msgs in form.errors.items():
            if error_msgs:
                errors[field] = error_msgs[0]
        print(errors)
        return JsonResponse({"error": errors})
