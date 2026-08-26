# To-Be-Done: Missing Routes & Pages

The following routes are referenced within the application (e.g., in Navigation sidebars or footers) but currently do not exist in the `app/` directory structure. They must be scaffolded out to prevent 404 errors.

| Route Path | Purpose / Goal | Prerequisites |
|---|---|---|
| `/legal/[slug]` | To dynamically render Legal pages like Privacy Policy, Terms of Service, and Security Audit (currently hardcoded as `href="/"` in the footer and referenced in `admin-legal-client.tsx`). | Requires static MDX content or CMS integration. No auth required. |
| `/dashboard/institute/batches` | To allow Institute administrators to view, manage, and assign faculty to specific student batches. | Requires `institute` or `admin` Auth State. |
| `/dashboard/institute/settings` | For Institute administrators to update their profile, billing information, and platform preferences. | Requires `institute` or `admin` Auth State. |
| `/dashboard/mentor/students` | A dashboard view for Mentors to monitor the progress of their assigned students and schedule 1-on-1 sessions. | Requires `mentor` or `admin` Auth State. |
| `/dashboard/mentor/resources` | To allow Mentors to upload, organize, and share study materials/PDFs with their students. | Requires `mentor` or `admin` Auth State. |
| `/dashboard/mentor/settings` | For Mentors to update their calendar availability, meeting links, and profile details. | Requires `mentor` or `admin` Auth State. |
| `app/error.tsx` | Global error boundary to elegantly catch and display unhandled runtime exceptions. | None (Global UI feature). |
| `app/not-found.tsx` | Global 404 fallback page to guide users back to the dashboard or home page when they hit a dead link. | None (Global UI feature). |
