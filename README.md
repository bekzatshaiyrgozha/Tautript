# Tautript
# TSIS 3 — Weekly Plan & Fact Report
 
## Tautrip – Mountain Tours & Equipment Aggregator
 
### Group members
 
- Zhursin Adil - 23B031859
- Dilnaz Yessenkyzy - 23B030348
- Aisulu Alpamys - 23B031203
- Bekzat Shaiyrgozha - 23B031482
- Orazova Amina - 23B031398
---
 
## Week Summary
 
This week the team successfully established the project foundation, completed MVP scope definition, and began sprint planning for Tautrip. We created the development environment, set up the GitHub repository, assigned team roles using RACI matrix, and initiated competitive research on tour platforms and equipment rental systems. The team held the project kick-off meeting and began scheduling user interviews with outdoor enthusiasts to validate market needs. Overall Status: **On Track**.
 
## Plan for the Week
 
- Define MVP scope and finalize feature list (login, tour browse, equipment filter, booking cart, user profile).
- Set up GitHub repository and configure local development environment (Node.js, React, FastAPI, MongoDB).
- Create UI/UX wireframes for login and tour browse pages in Figma.
- Conduct competitive research on 5+ existing tour platforms and equipment rental sites.
- Schedule and confirm first two user interviews with outdoor enthusiasts.
- Assign RACI roles and prepare sprint 1 backlog for refinement meeting.
## Plan & Fact Table
 
| Task | Planned Result | Actual Result | Status | Blocker | Next Step |
|------|----------------|---------------|--------|---------|-----------|
| MVP scope definition | Final approved feature list (6+ must-haves) | Completed; 6 must features confirmed in kickoff | On Track | None | Use feature list for sprint 1 backlog |
| GitHub repo & dev environment setup | Repository created; local environment ready for all team members | Repo created with .gitignore; 3 of 5 team members completed local setup | On Track | 2 devs need setup assistance | Send setup guide; pair programming session Thu |
| UI wireframes (login & tour browse) | Figma wireframes for authentication flow and homepage | Draft wireframes completed; pending UX/PM review | At Risk | Designer review cycle delayed | Schedule design review meeting by Wed; finalize by Fri |
| Competitive research (5 platforms) | Spreadsheet analysis with features, pricing, UX patterns | Research initiated; 4 competitors analyzed; document 60% complete | On Track | None | Complete analysis and present findings Mon |
| User interview scheduling | 2 interviews confirmed and scheduled | 1 interview confirmed (Sep 25, 3 PM); 1 pending response | At Risk | Difficulty recruiting qualified participants | Send follow-up via Slack + SMS by Tue |
| Sprint 1 backlog & RACI assignment | RACI matrix finalized; backlog items estimated | RACI matrix completed; backlog drafted with 12 user stories | On Track | None | Backlog refinement meeting Mon, Sep 30, 2 PM |
 
## Lessons Learned
 
1. **Communication channels matter:** Email alone is insufficient for time-sensitive scheduling; implementing Slack + SMS for urgent confirmations increased response rates and reduced delays.
2. **On boarding documentation:** Local development environment setup took longer than estimated due to missing step-by-step guides; next sprint will include automated setup scripts to reduce friction.
3. **Design feedback loops:** Ad-hoc wireframe reviews created bottlenecks; establishing weekly UX-PM sync meetings (every Monday and Thursday) will improve iteration speed and alignment.
4. **Early stakeholder engagement:** Scheduling user interviews early (first week) validates assumptions quickly; allocate dedicated resource for interview coordination to avoid bottlenecks.
## Risks & Mitigation
 
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user interview response rate | Delayed validation; incorrect MVP assumptions | Medium | Send SMS reminders; offer flexible scheduling options |
| Design review delays | Sprint 1 backlog blocked | Medium | Daily sync with UX designer; use async feedback tool (Loom) |
| Development environment setup | Sprint 1 velocity reduced | Low | Provide automated setup script; schedule pair programming |
 
## AI Disclosure
 
**Transparency Statement:** AI assistance was used for document formatting, structure organization, and language refinement only. All project data, task details, plan-fact entries, status assessments, and lessons learned reflect actual team decisions and observations. The PM is fully responsible for the accuracy and authenticity of all reported information.
 
## References
 
Meredith, J. R., & Mantel, S. J. (2019). *Project Management: A Managerial Approach* (8th ed.). Wiley. Ch. 3, Section 3.3, pp. 118–123.
 

---

## Development

| Part    | Stack                           | Folder     | How to run |
|---------|---------------------------------|------------|------------|
| Backend | Python 3.11+ · FastAPI · SQLite | `backend/` | [backend/README.md](backend/README.md) |
| iOS app | React Native (Expo) · TypeScript | `mobile/`  | [mobile/README.md](mobile/README.md) |

Quick start:

```bash
cd backend && make run-lan       # API → http://127.0.0.1:8000/health, docs at /docs
cd mobile && npm install && npm start   # second terminal → scan QR with iPhone (Expo Go)
```

Workflow: branch from `main` (`feature/<short-name>`), open a pull request to `main`.
