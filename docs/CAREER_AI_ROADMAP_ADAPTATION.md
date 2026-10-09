# Career AI Dynamic Roadmap Personalization & Adaptation Engine

## 1. Overview
The **Career Roadmap Engine** (Parts 8 & 9) dynamically constructs a multi-phase learning path tailored to candidate skill gaps, target role expectations, available weekly hours, skipped skills, and priority modes.

---

## 2. Dynamic Time Scaling Formula

Phase durations scale dynamically with user weekly time commitment:

$$\text{Time Multiplier} = \max\left(0.4, \frac{10}{\max(1, \text{weekly\_hours})}\right)$$

### Priority Mode Adjustments:
* **`Standard`**: Base time multiplier used.
* **`Accelerated`**: Time multiplier scaled by $0.75\times$ (condensed high-intensity path).
* **`Deep Mastery`**: Time multiplier scaled by $1.30\times$ (extended practice & deep theory).

---

## 3. Dynamic User Adaptation Overrides

The user can modify their roadmap constraints live in the UI:
1. **Target Role Change**: Regenerates roadmap phases dynamically for the new role.
2. **Weekly Study Hours Slider ($2 - 40$ hrs/wk)**: Recalculates total weeks and phase duration labels instantly.
3. **Skipped Skills Toggle**: Marking a skill as skipped removes it from learning phases while logging the override.
4. **`[Add to Roadmap]` Project Engine**: Portfolio projects matching critical gaps can be toggled directly into the capstone phase.

---

## 4. Phase Structure & "Why Scheduled Now" Callouts

Every phase object contains:
* `phase_number`: Sequential phase index ($1, 2, 3, 4$).
* `title`: Descriptive phase header.
* `duration_weeks`: Scaled duration integer.
* `duration_label`: Formatted label (e.g. `3 Weeks (10 hrs/wk)`).
* `objective`: Learning goal for the phase.
* `why_now`: Rationale explaining why this phase is scheduled at this point in sequence.
* `why_it_matters`: Hitting impact for interview and technical evaluation.
* `skills`: Canonical skills covered in phase.
* `prerequisites`: Required prior knowledge.
* `concepts_to_learn`: List of theoretical concepts.
* `practice_tasks`: List of hands-on coding exercises.
* `project`: Phase project deliverable object.
* `validation_checkpoint`: Success criterion to complete phase.
