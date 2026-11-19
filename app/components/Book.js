"use client";
import Typed from "./Typed";

const story = [
  "OBS Conference is an annual gathering organised by Open Bible School (OBS), born out of a deep hunger for God's Word and a desire to know, understand, and rightly interpret the Scriptures.",
  "The story of OBS dates back to 2020, when what started as a small gathering of a few friends in a living room gradually became something much more. We would come together, sometimes from morning until night, to study God's Word, exploring deep biblical and theological concepts such as Christology, Pneumatology, Soteriology, and Hermeneutics. It was a community of friends united by one thing: an insatiable desire to know God through His Word.",
  "Over the years, that hunger continued to grow. In 2026, we felt a burden to make this experience open to more people, extending beyond our immediate circle of friends and creating a space where anyone with a genuine desire to study and understand the Bible could participate.",
];
const vision = [
  "OBS Conference is an extension of that original vision: bringing people together to study the Bible, ask questions, engage in meaningful conversations, and grow in their understanding of God's Word.",
  "We envision an environment where biblical learning goes beyond surface-level knowledge, encouraging participants to think deeply, engage with Scripture, challenge their understanding, and develop a lifelong commitment to studying the Word.",
  "The conference is open to everyone who desires to know God more deeply, grow in their understanding of Scripture, and become more intentional about living out His Word.",
  "Our desire is simple: that everyone who attends leaves with a deeper understanding of the Scriptures, a greater love for God, and a renewed commitment to being a student of His Word.",
];

export default function Book() {
  return (
    <div className="book">
      <article>
        <div className="running"><span>Open Bible School</span><span>Our story</span></div>
        <Typed paras={story} />
      </article>
      <article>
        <div className="running"><span>Open Bible School</span><span>Our vision</span></div>
        <Typed paras={vision} delay={700} />
      </article>
    </div>
  );
}
