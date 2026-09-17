// Widget registry. Every top-level .svelte file in this folder is a widget,
// named by its filename: Stepper.svelte -> widget: "Stepper".
// Adding a widget = adding a file. Loaded lazily so lessons without one pay nothing.

const modules = import.meta.glob('./*.svelte');

/** @type {Record<string, () => Promise<any>>} */
export const WIDGETS = Object.fromEntries(
	Object.entries(modules).map(([path, load]) => [path.slice(2, -'.svelte'.length), load])
);

/** @param {string} name */
export function hasWidget(name) {
	return Object.hasOwn(WIDGETS, name);
}

/**
 * Resolves a widget name to its component.
 * @param {string} name
 */
export async function loadWidget(name) {
	const load = WIDGETS[name];
	if (!load) throw new Error(`Unknown widget "${name}" — valid widgets: ${Object.keys(WIDGETS).join(', ')}`);
	const mod = await load();
	return mod.default;
}
