exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        create table if not exists ${schema}.key_record (
            id uuid not null default uuid_generate_v4(),
            id_resource uuid not null,
            key text not null,
            constraint key_record_pk primary key (id),
            constraint key_record_resource_fk foreign key(id_resource) references ${schema}.resource(id)
        );

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.key_record
  `);
};
