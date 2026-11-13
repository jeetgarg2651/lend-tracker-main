
exports.up = async function (knex) {
    await knex.schema.createTable("customers", (table) => {
        table.increments("id").primary();

        table.string("full_name", 150).notNullable();
        table.string("phone", 20).notNullable();
        table.string("email", 255).nullable();
        table.text("address").nullable();

        table.text("notes").nullable();

        table.boolean("is_active").notNullable().defaultTo(true);

        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

        table.index("phone", "idx_customers_phone");
        table.index("full_name", "idx_customers_name");
        table.index("is_active", "idx_customers_active");
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("customers");
};
