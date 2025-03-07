import { Repository } from "typeorm";
import { Employee } from "../entity/Employee";
import { Project } from "../entity/Project";

export class EmployeeService {
    constructor(
        private employeeRepository: Repository<Employee>,
        private projectRepository: Repository<Project>
    ) {}

    async assignProjectToEmployee(employeeId: number, projectId: number): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({
            where: { id: employeeId },
            relations: ['projects']
        });
        
        if (!employee) {
            throw new Error('Employee not found');
        }

        const project = await this.projectRepository.findOne({
            where: { id: projectId }
        });

        if (!project) {
            throw new Error('Project not found');
        }

        if (!employee.projects) {
            employee.projects = [];
        }

        employee.projects.push(project);
        return await this.employeeRepository.save(employee);
    }
}