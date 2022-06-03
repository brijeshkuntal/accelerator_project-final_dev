from .models.employee_models import Employee
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json

@api_view(['GET'])
def get_users(request):
    tenant = request.tenant
    print(tenant.name)
    print(dir(request))
    emp_obj = Employee.objects.filter(empOrg=tenant.name)
    emp_list = []
    for obj in emp_obj:
        data = {
            "empName": obj.empName,
            "empDOJ": obj.empDOJ,
            "empOrg": obj.empOrg,
            "empID": obj.empID
        }
        emp_list.append(data)
    return Response({"data": emp_list},status=status.HTTP_200_OK)