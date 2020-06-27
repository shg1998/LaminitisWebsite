from django.urls import reverse
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic import CreateView, DeleteView, DetailView, UpdateView, ListView
from .models import Patient, ImagePatient
from base_app.CustomStuff import overrideTempDicom


class PatientListView(LoginRequiredMixin, ListView):
    model = Patient
    paginate_by = 8

    def get_queryset(self):
        return Patient.objects.filter(doctor_pati=self.request.user).order_by('-date_pati')


class PatientDetailView(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = Patient

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['image_class_list'] = ImagePatient.objects.filter(patient_imag=self.get_object())
        return context

    def test_func(self):
        patient = self.get_object()
        if patient.doctor_pati == self.request.user:
            return True
        return False


class PatientCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Patient
    success_message = "patient created successfully"
    fields = ['name_pati', 'description_pati']

    def form_valid(self, form):
        form.instance.doctor_pati = self.request.user
        return super().form_valid(form)


class PatientUpdateView(LoginRequiredMixin, SuccessMessageMixin, UserPassesTestMixin, UpdateView):
    model = Patient
    success_message = "patient updated successfully"
    fields = ['name_pati', 'description_pati']

    def form_valid(self, form):
        form.instance.doctor_pati = self.request.user
        return super().form_valid(form)

    def test_func(self):
        patient = self.get_object()
        if patient.doctor_pati == self.request.user:
            return True
        return False


class PatientDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Patient

    def get_success_url(self):
        return reverse('patient-create')

    def test_func(self):
        patient = self.get_object()
        if patient.doctor_pati == self.request.user:
            return True
        return False


# ********* ImagesViews bellow *********
class ImageAddView(LoginRequiredMixin, UserPassesTestMixin, SuccessMessageMixin, CreateView):
    model = ImagePatient
    fields = ['image_imag']
    success_message = "image added"
    template_name = 'patient/image_add.html'

    def post(self, request, *args, **kwargs):
        if request.FILES['image_imag'].name.endswith('.dcm'):
            png_bytes=overrideTempDicom(request.FILES['image_imag'])

        return super().post(request, *args, **kwargs)

    def form_valid(self, form):
        form.instance.patient_imag = Patient.objects.filter(pk=self.kwargs["patient_id"]).first()
        form.instance.points_imag = []
        return super().form_valid(form)

    def test_func(self):
        patient = Patient.objects.filter(pk=self.kwargs["patient_id"]).first()
        if patient.doctor_pati == self.request.user:
            return True
        return False


class ImageDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = ImagePatient
    template_name = 'patient/image_confirm_delete.html'

    def get_object(self):
        object=ImagePatient.objects.filter(patient_imag=self.kwargs["patient_id"])[self.kwargs["image_id"]]
        self.pk=object.pk
        return object

    def get_success_url(self):
        return reverse('patient-detail', kwargs={'pk': self.kwargs["patient_id"]})

    def test_func(self):
        patient = self.get_object().patient_imag
        if patient.doctor_pati == self.request.user:
            return True
        return False


class PointsUpdateView(LoginRequiredMixin, UserPassesTestMixin, SuccessMessageMixin, UpdateView):
    model = ImagePatient
    fields = ['points_imag']
    success_message = "points edited"
    template_name = 'patient/edit_points_form.html'

    def get_object(self):
        object=ImagePatient.objects.filter(patient_imag=self.kwargs["patient_id"])[self.kwargs["image_id"]]
        self.pk=object.pk
        return object

    def form_valid(self, form):
        p=form.instance.points_imag
        form.instance.points_imag = [[p[i-1][0], p[i][0]] for i in range(1,len(p),2)]
        return super().form_valid(form)

    def test_func(self):
        patient = self.get_object().patient_imag
        if patient.doctor_pati == self.request.user:
            return True
        return False
