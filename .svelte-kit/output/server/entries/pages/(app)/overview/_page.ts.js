import { redirect } from "@sveltejs/kit";
//#region src/routes/(app)/overview/+page.ts
function load() {
	redirect(307, "/dashboard");
}
//#endregion
export { load };
