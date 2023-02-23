import { BaseModule } from ".";
import { getBlock } from "../../utils/getBlock";
//import "./Accordion.scss";

function AccordionItem({ id, props = {} }: BaseModule) {
  const { headline, detailTextJson } = props;
  const inputId = id;
  return (
    <>
      <input type="radio" name="accordion" id={inputId} />
      <section className="box">
        <label className="box-title" htmlFor={inputId}>
          {headline}
        </label>
        <label className="box-close" htmlFor="acc-close"></label>
        <div className="box-content">{getBlock(detailTextJson)}</div>
      </section>
    </>
  );
}

export default function Accordion({ id, modules }: BaseModule) {
  return (
    <nav className="accordion arrows">
      <input type="radio" name="accordion" />
      {modules?.map((item) => (
        <AccordionItem key={item.id} {...item} />
      ))}
      <input type="radio" name="accordion" id="acc-close" />
    </nav>
  );
}
