import { skillItems } from "../data";

export function SkillMatrix() {
  return (
    <div className="skill-matrix">
      <h2>[ SKILL_MATRIX ]</h2>
      <div>
        {skillItems.map((skill) => (
          <span key={skill.label}>
            {skill.icon && <skill.icon aria-hidden="true" />}
            {skill.imageSrc && <img src={skill.imageSrc} alt="" aria-hidden="true" />}
            {!skill.icon && !skill.imageSrc && <b aria-hidden="true">~/</b>}
            {skill.label}
          </span>
        ))}
      </div>
    </div>
  );
}
