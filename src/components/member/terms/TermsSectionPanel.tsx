import type { TermsSectionContent } from "./mockData";
import { TermsBullet, TermsParagraph } from "./termsRichText";

type TermsSectionPanelProps = {
  content: TermsSectionContent;
};

export function TermsSectionPanel({ content }: TermsSectionPanelProps) {
  return (
    <section className="space-y-10">
      <h2 className="font-roboto text-[14px] font-semibold tracking-[0.16em] text-primary uppercase">
        {content.heading}
      </h2>

      <div className="space-y-6">
        {content.paragraphs?.map((paragraph, index) => (
          <TermsParagraph key={index} text={paragraph} />
        ))}
      </div>

      {content.subsections?.map((subsection) => (
        <div
          key={subsection.title}
          className="space-y-5 border-t border-accent/8 pt-8 first:border-t-0 first:pt-0"
        >
          <h3 className="font-roboto text-[13px] font-semibold tracking-[0.12em] text-foreground uppercase">
            {subsection.title}
          </h3>

          <div className="space-y-5">
            {subsection.paragraphs?.map((paragraph, index) => (
              <TermsParagraph key={index} text={paragraph} />
            ))}

            {subsection.bullets ? (
              <ul className="max-w-3xl space-y-3 pl-1">
                {subsection.bullets.map((bullet) => (
                  <TermsBullet
                    key={bullet}
                    text={bullet}
                    variant={subsection.bulletVariant}
                  />
                ))}
              </ul>
            ) : null}

            {subsection.footerParagraphs?.map((paragraph, index) => (
              <TermsParagraph key={index} text={paragraph} />
            ))}
          </div>
        </div>
      ))}

      {content.cards ? (
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="member-page-card rounded-xl px-5 py-4"
            >
              <p className="font-roboto text-[14px] tracking-[0.01em] text-foreground">
                {card.title}
              </p>
              <p className="font-roboto mt-1 text-[12px] tracking-[0.02em] text-secondary">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
