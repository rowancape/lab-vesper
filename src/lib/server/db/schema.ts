import { eq, isNull, not, relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
})

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey(),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull().unique(),
  description: text("description").notNull().unique(),
  servings: integer("servings").notNull(),
  difficulty: integer("difficulty").notNull(),
  
  // Author estimates
  activeTimeMin: integer("active_time_min").notNull(),
  activeTimeMax: integer("active_time_max").notNull(),
  inactiveTimeMin: integer("inactive_time_min").notNull(),
  inactiveTimeMax: integer("inactive_time_max").notNull(),
});

export const tagCategories = sqliteTable("tag_categories", {
  id: integer("id").primaryKey(),
  key: text("key").notNull().unique(),
  labelEn: text("label_en").notNull(),
  labelFi: text("label_fi").notNull(),
  userTipEn: text("user_tip_en").notNull(),
  userTipFi: text("user_tip_fi").notNull(),
});

export const tags = sqliteTable(
  "tags", 
  {
    id: integer("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => tagCategories.id),
    label: text("label").notNull()
  },
  (t) => [
    uniqueIndex("tags_category_label_unique")
      .on(t.categoryId, t.label)
  ]
);

export const recipeTags = sqliteTable(
  "recipe_tags", 
  {
    id: integer("id").primaryKey(),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => [
    uniqueIndex("recipe_tags_recipe_tag_unique")
      .on(t.recipeId, t.tagId)
  ]
);

export const cuisines = sqliteTable(
  "cuisines", 
  {
    id: integer("id").primaryKey(),
    label: text("label").notNull(),
    weight: integer("weight").notNull(),
    isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
    parentId: integer("parent_id")
      .notNull()
      .references((): AnySQLiteColumn => cuisines.id),
  },
  (t) => [
    uniqueIndex("cuisines_label_parent_unique")
      .on(t.label, t.parentId)
  ]
);

// =============================
// -------- RELATIONS ----------
// =============================

export const tagCategoriesRelations = relations(tagCategories, ({ many }) => ({
  tags: many(tags)
}));

export const tagsRelations = relations(tags, ({ one }) => ({
  tagCategories: one(tagCategories, {
    fields: [tags.categoryId],
    references: [tagCategories.id]
  })
}));