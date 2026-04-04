import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIssue } from "../../api/issueApi";
import Button from "../../components/common/Button";
import PageHeader from "../../components/layout/PageHeader";
import useGeoLocation from "../../hooks/useGeoLocation";

const categories = ["road", "water", "electricity", "other"];

export default function CreateIssuePage() {
  const navigate = useNavigate();
  const { coordinates, setCoordinates, loading: geoLoading, error: geoError, requestLocation } = useGeoLocation(true);
  const [form, setForm] = useState({
    description: "",
    category: "road",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!form.image) {
      return "";
    }

    return URL.createObjectURL(form.image);
  }, [form.image]);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!coordinates.lat || !coordinates.lng) {
        throw new Error("Please provide a valid location before submitting.");
      }

      if (form.image && !["image/", "video/mp4"].some(type => form.image.type.startsWith(type))) {
        throw new Error("Only images and MP4 videos are supported.");
      }

      const payload = new FormData();
      payload.append("description", form.description);
      payload.append("category", form.category);
      payload.append("lat", coordinates.lat);
      payload.append("lng", coordinates.lng);

      if (form.image) {
        payload.append("image", form.image);
      }

      const response = await createIssue(payload);

      if (!response.success) {
        throw new Error(response.message || "Unable to create issue");
      }

      navigate(`/issues/${response.issue._id}`);
    } catch (submitError) {
      setError(submitError.response?.data?.message || submitError.message || "Unable to create issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create issue"
        title="Report a new local problem"
        description="Upload a photo or short video, describe the issue clearly, pick the right category, and attach the location where it happened."
        actions={
          <Button variant="secondary" onClick={requestLocation}>
            {geoLoading ? "Locating..." : "Use my location"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <form className="surface space-y-5 p-6" onSubmit={handleSubmit}>
          <div>
            <label className="label">Description</label>
            <textarea
              className="field min-h-36"
              required
              placeholder="Describe what happened and what residents are experiencing."
              value={form.description}
              onChange={event => setForm(current => ({ ...current, description: event.target.value }))}
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="field"
              value={form.category}
              onChange={event => setForm(current => ({ ...current, category: event.target.value }))}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Image or video</label>
            <input
              className="field"
              type="file"
              accept="image/*,video/mp4"
              onChange={event => setForm(current => ({ ...current, image: event.target.files?.[0] || null }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Latitude</label>
              <input
                className="field"
                type="number"
                step="any"
                required
                value={coordinates.lat}
                onChange={event => setCoordinates(current => ({ ...current, lat: event.target.value }))}
              />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input
                className="field"
                type="number"
                step="any"
                required
                value={coordinates.lng}
                onChange={event => setCoordinates(current => ({ ...current, lng: event.target.value }))}
              />
            </div>
          </div>

          {geoError ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{geoError}</p> : null}
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Submitting..." : "Submit issue"}
          </Button>
        </form>

        <aside className="surface p-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-pine">Preview</p>
          <div className="mt-4 space-y-4">
            {previewUrl ? (
              form.image?.type.startsWith("video") ? (
                <video controls className="h-60 w-full rounded-[1.4rem] bg-ink object-cover">
                  <source src={previewUrl} />
                </video>
              ) : (
                <img src={previewUrl} alt="Issue preview" className="h-60 w-full rounded-[1.4rem] object-cover" />
              )
            ) : (
              <div className="flex h-60 items-center justify-center rounded-[1.4rem] bg-mist text-sm font-semibold text-ink/45">
                Media preview will appear here
              </div>
            )}

            <div className="rounded-[1.4rem] bg-mist p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">{form.category}</p>
              <p className="mt-3 text-base font-semibold leading-7 text-ink">
                {form.description || "Your issue description will appear here."}
              </p>
              <p className="mt-4 text-sm text-ink/60">
                Coordinates: {coordinates.lat || "--"}, {coordinates.lng || "--"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
