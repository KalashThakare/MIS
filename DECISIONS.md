# Technical Decisions

## 1. Database Choice

### Decision

I chose PostgreSQL (Supabase) as the primary database.

### Why it was chosen

Carrying out relations between different entities using foreign key constraints is very helpful. Relations between different models are important in a meeting intelligence system where meetings, action items, users, and reminder logs are all connected to each other. PostgreSQL provides strong relational capabilities and data integrity, which made it a good fit for this project.

### Alternatives Considered

* MongoDB
* MySQL

MongoDB offers flexibility with schema design, but the project relies heavily on relationships between entities. MySQL was also a viable option, but I was more comfortable working with PostgreSQL and its ecosystem.

### Trade-offs

PostgreSQL requires more upfront schema design compared to document databases. Making changes to the schema later can require migrations, but in return it provides strong consistency and relational integrity.

## 2. Authentication Strategy

### Decision

I used JWT authentication with Bearer Tokens.

### Why it was chosen

JWT provides a stateless authentication mechanism, which means the server does not need to store session information. Each request carries its own authentication token, making the system easier to scale.

JWTs are also signed, which helps prevent token tampering. Combined with proper password hashing and HTTPS, this protects against common authentication-related attacks such as credential exposure and unauthorized request access.

### Alternatives Considered

* OAuth 2.0

OAuth is a great choice when integrating with third-party identity providers such as Google or GitHub. However, for this project, a custom JWT-based authentication flow was simpler and sufficient.

### Trade-offs

The current implementation uses access tokens only. Refresh token rotation, token revocation, and advanced session management were not implemented to keep the scope focused on the assessment requirements.

## 3. External Integration Selection

### Decision

I chose to integrate Slack Webhooks for notifications.

### Why it was chosen

The project includes reminder scheduling for overdue action items. Slack webhooks provide a simple way to send real-time notifications to a channel without requiring complex setup. It also demonstrates integration with a real third-party service while keeping the implementation straightforward.

### Alternatives Considered

* Email notifications using Nodemailer

Email is something users interact with regularly and would also be a strong choice for reminder delivery. I considered implementing email notifications through Nodemailer, but Slack webhooks required less setup and fit naturally into the reminder workflow.

### Trade-offs

Slack notifications are limited to Slack workspaces and require users to actively use Slack. Email notifications would likely reach a broader audience, but would involve additional setup and delivery considerations.

---

## 4. Project Structure

### Decision

I organized the codebase as a modular monolith with a domain-based folder structure. Each domain (auth, meetings, action-items, reminders) owns its controllers, services, repositories, models, and types.

### Why it was chosen

The project scope was clear but expected to grow. A modular monolith provides clean separation between domains without introducing the operational complexity of microservices. It keeps development simple while maintaining clear boundaries between modules.

### Alternatives Considered

* Flat MVC structure - rejected because it becomes harder to maintain as features grow and domain logic starts mixing together.
* Microservices - considered unnecessary for the current project size and would add deployment, networking, and operational complexity.

### Trade-offs

All modules run within the same process and share the same database, so issues in one module can affect the whole application. However, the domain boundaries are already separated, making it easier to split modules into independent services later if required.
