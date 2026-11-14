import { secrets } from 'base44:runtime';

// Serves the Maps JavaScript key to the map component. This is a browser key,
// restricted by HTTP referrer to the app's own domains, so it only works in the map.
export default async function (req) {
  try {
    const key = secrets.get('GOOGLE_MAPS_API_KEY');
    if (!key) return Response.json({ key: null });
    return Response.json({ key });
  } catch (error) {
    return Response.json({ key: null, error: error.message }, { status: 200 });
  }
}