exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        create table if not exists ${schema}.super_admin (
            id_user uuid not null,
            created timestamp with time zone not null default now(), 
            constraint super_admin_pk primary key (id_user),
            constraint super_admin_fk foreign key (id_user) references ${schema}.user(id)
        );

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.super_admin
  `);
};
