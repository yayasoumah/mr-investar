

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";


COMMENT ON SCHEMA "public" IS 'standard public schema';


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";



CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";



CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";



CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";



CREATE TYPE "public"."file_visibility_type" AS ENUM (
    'all',
    'opportunity_viewers',
    'specific_users'
);


ALTER TYPE "public"."file_visibility_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_file_access"("file_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.files f
    WHERE f.id = file_id
    AND (
      f.visibility = 'all' OR
      (f.visibility = 'opportunity_viewers' AND public.user_has_access_to_opportunity(f.opportunity_id, auth.uid())) OR
      (f.visibility = 'specific_users' AND auth.uid() IN (SELECT user_id FROM public.file_user_access WHERE file_id = file_id))
    )
  );
$$;


ALTER FUNCTION "public"."get_user_file_access"("file_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_access_to_opportunity"("opportunity_id" "uuid", "user_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.investment_opportunities
    WHERE id = opportunity_id
    AND (
      visibility = 'active' OR
      visibility = 'concluded' OR
      (visibility = 'coming_soon' AND user_id IN (SELECT user_id FROM public.user_to_user_type WHERE user_type_id = (SELECT id FROM public.user_types WHERE name = 'Investor'))) OR
      (visibility = 'private' AND user_id IN (SELECT user_id FROM public.private_investment_access WHERE opportunity_id = opportunity_id))
    )
  );
$$;


ALTER FUNCTION "public"."user_has_access_to_opportunity"("opportunity_id" "uuid", "user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."admin_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file_user_access" (
    "file_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."file_user_access" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."files" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "opportunity_id" "uuid",
    "name" "text" NOT NULL,
    "size" bigint NOT NULL,
    "url" "text" NOT NULL,
    "visibility" "public"."file_visibility_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "uploaded_by" "uuid"
);


ALTER TABLE "public"."files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."images" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "section_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "caption" "text",
    "details" "text",
    "order_number" smallint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."investment_opportunities" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "admin_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "location" "jsonb",
    "visibility" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "external_url" "text",
    "external_platform" "text",
    CONSTRAINT "investment_opportunities_visibility_check" CHECK (("visibility" = ANY (ARRAY['draft'::"text", 'private'::"text", 'coming_soon'::"text", 'active'::"text", 'concluded'::"text"])))
);


ALTER TABLE "public"."investment_opportunities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."private_investment_access" (
    "opportunity_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."private_investment_access" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sections" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "opportunity_id" "uuid" NOT NULL,
    "section_type" "text" NOT NULL,
    "custom_title" "text",
    "custom_content" "text",
    "order_number" smallint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "date_of_birth" "date",
    "nationality" "text",
    "location" "jsonb",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_to_user_type" (
    "user_id" "uuid" NOT NULL,
    "user_type_id" smallint NOT NULL
);


ALTER TABLE "public"."user_to_user_type" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_types" (
    "id" smallint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."user_types" OWNER TO "postgres";


ALTER TABLE "public"."user_types" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."user_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."admin_profiles"
    ADD CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."file_user_access"
    ADD CONSTRAINT "file_user_access_pkey" PRIMARY KEY ("file_id", "user_id");



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."investment_opportunities"
    ADD CONSTRAINT "investment_opportunities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."private_investment_access"
    ADD CONSTRAINT "private_investment_access_pkey" PRIMARY KEY ("opportunity_id", "user_id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_to_user_type"
    ADD CONSTRAINT "user_to_user_type_pkey" PRIMARY KEY ("user_id", "user_type_id");



ALTER TABLE ONLY "public"."user_types"
    ADD CONSTRAINT "user_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."user_types"
    ADD CONSTRAINT "user_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_profiles"
    ADD CONSTRAINT "admin_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."file_user_access"
    ADD CONSTRAINT "file_user_access_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."file_user_access"
    ADD CONSTRAINT "file_user_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "public"."investment_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admin_profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."investment_opportunities"
    ADD CONSTRAINT "investment_opportunities_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."private_investment_access"
    ADD CONSTRAINT "private_investment_access_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "public"."investment_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."private_investment_access"
    ADD CONSTRAINT "private_investment_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "public"."investment_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_to_user_type"
    ADD CONSTRAINT "user_to_user_type_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_to_user_type"
    ADD CONSTRAINT "user_to_user_type_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "public"."user_types"("id") ON DELETE CASCADE;



CREATE POLICY "Admin profiles are viewable by users who created them." ON "public"."admin_profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Admins can manage all file_user_access entries" ON "public"."file_user_access" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "admin_profiles"."id"
   FROM "public"."admin_profiles")));



CREATE POLICY "Admins can manage all files" ON "public"."files" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "admin_profiles"."id"
   FROM "public"."admin_profiles")));



CREATE POLICY "Admins can manage all images" ON "public"."images" USING (("auth"."uid"() IN ( SELECT "admin_profiles"."id"
   FROM "public"."admin_profiles")));



CREATE POLICY "Admins can manage all investment opportunities" ON "public"."investment_opportunities" USING (("auth"."uid"() IN ( SELECT "admin_profiles"."id"
   FROM "public"."admin_profiles")));



CREATE POLICY "Admins can manage all sections" ON "public"."sections" USING (("auth"."uid"() IN ( SELECT "admin_profiles"."id"
   FROM "public"."admin_profiles")));



CREATE POLICY "Admins can manage private investment access" ON "public"."private_investment_access" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "admin_profiles"."id"
   FROM "public"."admin_profiles"))) WITH CHECK (("auth"."uid"() IN ( SELECT "admin_profiles"."id"
   FROM "public"."admin_profiles")));



CREATE POLICY "User profiles are viewable by users who created them." ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can delete their own user type associations." ON "public"."user_to_user_type" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own admin profile." ON "public"."admin_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own profile." ON "public"."user_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own user type associations." ON "public"."user_to_user_type" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own admin profile." ON "public"."admin_profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own profile." ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view files based on visibility" ON "public"."files" FOR SELECT TO "authenticated" USING ("public"."get_user_file_access"("id"));



CREATE POLICY "Users can view images of visible opportunity sections" ON "public"."images" FOR SELECT USING ((("section_id" IN ( SELECT "sections"."id"
   FROM "public"."sections"
  WHERE ("sections"."opportunity_id" IN ( SELECT "investment_opportunities"."id"
           FROM "public"."investment_opportunities"
          WHERE (("investment_opportunities"."visibility" = 'active'::"text") OR ("investment_opportunities"."visibility" = 'concluded'::"text")))))) OR ("section_id" IN ( SELECT "sections"."id"
   FROM "public"."sections"
  WHERE ("sections"."opportunity_id" IN ( SELECT "investment_opportunities"."id"
           FROM "public"."investment_opportunities"
          WHERE (("investment_opportunities"."visibility" = 'coming_soon'::"text") AND ("auth"."uid"() IN ( SELECT "user_to_user_type"."user_id"
                   FROM "public"."user_to_user_type"
                  WHERE ("user_to_user_type"."user_type_id" = ( SELECT "user_types"."id"
                           FROM "public"."user_types"
                          WHERE ("user_types"."name" = 'Investor'::"text")))))))))) OR ("section_id" IN ( SELECT "sections"."id"
   FROM "public"."sections"
  WHERE ("sections"."opportunity_id" IN ( SELECT "investment_opportunities"."id"
           FROM "public"."investment_opportunities"
          WHERE (("investment_opportunities"."visibility" = 'private'::"text") AND ("auth"."uid"() IN ( SELECT "private_investment_access"."user_id"
                   FROM "public"."private_investment_access"
                  WHERE ("private_investment_access"."opportunity_id" = "private_investment_access"."opportunity_id"))))))))));



CREATE POLICY "Users can view opportunities based on visibility" ON "public"."investment_opportunities" FOR SELECT USING ((("visibility" = 'active'::"text") OR ("visibility" = 'concluded'::"text") OR (("visibility" = 'coming_soon'::"text") AND ("auth"."uid"() IN ( SELECT "user_to_user_type"."user_id"
   FROM "public"."user_to_user_type"
  WHERE ("user_to_user_type"."user_type_id" = ( SELECT "user_types"."id"
           FROM "public"."user_types"
          WHERE ("user_types"."name" = 'Investor'::"text")))))) OR (("visibility" = 'private'::"text") AND ("auth"."uid"() IN ( SELECT "private_investment_access"."user_id"
   FROM "public"."private_investment_access"
  WHERE ("private_investment_access"."opportunity_id" = "investment_opportunities"."id"))))));



CREATE POLICY "Users can view sections of visible opportunities" ON "public"."sections" FOR SELECT USING ((("opportunity_id" IN ( SELECT "investment_opportunities"."id"
   FROM "public"."investment_opportunities"
  WHERE (("investment_opportunities"."visibility" = 'active'::"text") OR ("investment_opportunities"."visibility" = 'concluded'::"text")))) OR ("opportunity_id" IN ( SELECT "investment_opportunities"."id"
   FROM "public"."investment_opportunities"
  WHERE (("investment_opportunities"."visibility" = 'coming_soon'::"text") AND ("auth"."uid"() IN ( SELECT "user_to_user_type"."user_id"
           FROM "public"."user_to_user_type"
          WHERE ("user_to_user_type"."user_type_id" = ( SELECT "user_types"."id"
                   FROM "public"."user_types"
                  WHERE ("user_types"."name" = 'Investor'::"text")))))))) OR ("opportunity_id" IN ( SELECT "investment_opportunities"."id"
   FROM "public"."investment_opportunities"
  WHERE (("investment_opportunities"."visibility" = 'private'::"text") AND ("auth"."uid"() IN ( SELECT "private_investment_access"."user_id"
           FROM "public"."private_investment_access"
          WHERE ("private_investment_access"."opportunity_id" = "private_investment_access"."opportunity_id"))))))));



CREATE POLICY "Users can view their own file access entries" ON "public"."file_user_access" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own private investment access" ON "public"."private_investment_access" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own user type associations." ON "public"."user_to_user_type" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."admin_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."file_user_access" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."investment_opportunities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."private_investment_access" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_to_user_type" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





GRANT ALL ON FUNCTION "public"."get_user_file_access"("file_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_file_access"("file_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_file_access"("file_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_access_to_opportunity"("opportunity_id" "uuid", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_access_to_opportunity"("opportunity_id" "uuid", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_access_to_opportunity"("opportunity_id" "uuid", "user_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."admin_profiles" TO "anon";
GRANT ALL ON TABLE "public"."admin_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."file_user_access" TO "anon";
GRANT ALL ON TABLE "public"."file_user_access" TO "authenticated";
GRANT ALL ON TABLE "public"."file_user_access" TO "service_role";



GRANT ALL ON TABLE "public"."files" TO "anon";
GRANT ALL ON TABLE "public"."files" TO "authenticated";
GRANT ALL ON TABLE "public"."files" TO "service_role";



GRANT ALL ON TABLE "public"."images" TO "anon";
GRANT ALL ON TABLE "public"."images" TO "authenticated";
GRANT ALL ON TABLE "public"."images" TO "service_role";



GRANT ALL ON TABLE "public"."investment_opportunities" TO "anon";
GRANT ALL ON TABLE "public"."investment_opportunities" TO "authenticated";
GRANT ALL ON TABLE "public"."investment_opportunities" TO "service_role";



GRANT ALL ON TABLE "public"."private_investment_access" TO "anon";
GRANT ALL ON TABLE "public"."private_investment_access" TO "authenticated";
GRANT ALL ON TABLE "public"."private_investment_access" TO "service_role";



GRANT ALL ON TABLE "public"."sections" TO "anon";
GRANT ALL ON TABLE "public"."sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sections" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_to_user_type" TO "anon";
GRANT ALL ON TABLE "public"."user_to_user_type" TO "authenticated";
GRANT ALL ON TABLE "public"."user_to_user_type" TO "service_role";



GRANT ALL ON TABLE "public"."user_types" TO "anon";
GRANT ALL ON TABLE "public"."user_types" TO "authenticated";
GRANT ALL ON TABLE "public"."user_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_types_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";





RESET ALL;
