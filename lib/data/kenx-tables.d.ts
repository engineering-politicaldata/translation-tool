declare module 'knex/types/tables' {
    interface Project {
        id: string;
        name: string;
        description: string;
        created: any;
        updated: any;
    }

    interface Resource {
        id: string;
        id_project: string;
        resource_name: string;
        created: any;
        updated: any;
    }

    interface KeyRecord {
        id: string;
        id_resource: string;
        key: string;
    }
    interface KeyRecordTranslation {
        id_key_record: string;
        id_language: string;
        value: string;
    }

    interface ProjectLanguage {
        id_project: string;
        id_language: string;
        is_source_language: boolean;
    }

    interface User {
        id: string;
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        created: any;
        updated: any;
    }
    interface SuperAdmin {
        id_user: string;
        created: any;
    }
    interface UserProject {
        id_user: string;
        id_project: string;
        created: any;
    }

    interface Tables {
        // This is same as specifying `knex<Project>('project')`
        project: Project;
        resource: Resource;
        key_record: KeyRecord;
        key_record__translation: KeyRecordTranslation;
        project__language: ProjectLanguage;
        user: User;
        super_admin: SuperAdmin;
        user__project: UserProject;
    }
}
