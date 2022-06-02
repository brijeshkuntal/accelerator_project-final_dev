from .models.employee_models import Employee
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_users(request):
    tenant = request.tenant
    print(tenant.name)
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
    return Response({"data": emp_list})