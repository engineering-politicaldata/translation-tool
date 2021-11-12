exports.up = function (knex) {
    return knex.raw(`
    DO $$
    BEGIN
        IF NOT EXISTS(
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name = '${process.env.DB_SCHEMA || 'translation'}'
        )
        THEN
        EXECUTE 'CREATE SCHEMA ${process.env.DB_SCHEMA || 'translation'}';
        END IF;
    END
    $$;
  `);
};

exports.down = function (knex) {};
