exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        alter table ${schema}.key_record__translation 
            add column created timestamp with time zone not null default now(), 
            add column updated timestamp with time zone;

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    alter table ${schema}.key_record__translation 
        drop column created, 
        drop column updated;
  `);
};
