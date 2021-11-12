exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        create table if not exists ${schema}.key_record__translation (
            id_key_record uuid not null,
            id_language uuid not null,
            value text, 
            constraint key_record__translation_pk primary key (id_key_record, id_language),
            constraint key_record__translation_record foreign key (id_key_record) references ${schema}.key_record(id),
            constraint key_record__translation_language foreign key (id_language) references ${schema}.language(id)
        );

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.key_record__translation
  `);
};
