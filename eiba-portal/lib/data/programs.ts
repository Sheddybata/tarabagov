export interface Program {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  duration?: string;
  format?: string;
  targetAudience: string;
  icon: string;
}

export const programs: Program[] = [
  {
    id: "1",
    slug: "biblical-foundations",
    name: "School of Biblical Foundations",
    shortDescription: "A diploma program focused on essential doctrines, Bible interpretation, spiritual disciplines, and Christian ethics.",
    fullDescription: "This foundational program provides students with a comprehensive understanding of core Christian doctrines, proper Bible interpretation methods, essential spiritual disciplines, and Christian ethics. Perfect for new believers and those seeking to strengthen their biblical foundation.",
    duration: "1 Year",
    format: "Diploma",
    targetAudience: "Foundation-level students, new believers",
    icon: "book-open",
  },
  {
    id: "2",
    slug: "ministry-fivefold",
    name: "School of Ministry & Fivefold Leadership",
    shortDescription: "Training for pastors, teachers, prophets, evangelists, and apostles—equipping believers for effective ministry and service.",
    fullDescription: "Comprehensive training for the fivefold ministry gifts: pastors, teachers, prophets, evangelists, and apostles. This program equips believers with the knowledge, skills, and spiritual authority needed for effective ministry and service in the body of Christ.",
    duration: "2 Years",
    format: "Certificate/Diploma",
    targetAudience: "Aspiring ministers, church leaders",
    icon: "users",
  },
  {
    id: "3",
    slug: "kingdom-leadership",
    name: "Kingdom Leadership & Governance Program",
    shortDescription: "A leadership course preparing believers to influence politics, policy, and governance with integrity and biblical values.",
    fullDescription: "This specialized program prepares believers to influence politics, policy, and governance with integrity and biblical values. Students learn how to apply kingdom principles to leadership roles in government, policy development, and public service.",
    duration: "1 Year",
    format: "Certificate",
    targetAudience: "Leaders in government, policy, governance",
    icon: "crown",
  },
  {
    id: "4",
    slug: "prayer-intercession",
    name: "School of Prayer & Intercession",
    shortDescription: "A deep spiritual formation track on prophetic intercession, warfare prayer, and national transformation through prayer.",
    fullDescription: "An intensive spiritual formation program focused on prophetic intercession, warfare prayer, and national transformation through prayer. Students learn the principles and practices of effective intercessory prayer and spiritual warfare.",
    duration: "6 Months",
    format: "Certificate",
    targetAudience: "Intercessors, prayer leaders",
    icon: "heart",
  },
  {
    id: "5",
    slug: "apologetics-worldview",
    name: "Christian Apologetics & Worldview Studies",
    shortDescription: "Equipping students to defend the faith, engage culture, and address societal issues with Scripture-based reasoning.",
    fullDescription: "This program equips students to defend the Christian faith, engage contemporary culture, and address societal issues with Scripture-based reasoning. Students learn to articulate and defend biblical truth in various contexts.",
    duration: "1 Year",
    format: "Certificate/Diploma",
    targetAudience: "Students, teachers, public speakers",
    icon: "shield",
  },
  {
    id: "6",
    slug: "missions-evangelism",
    name: "Missions & Evangelism Academy",
    shortDescription: "Focused on cross-cultural missions, urban evangelism, digital evangelism, and humanitarian outreach skills.",
    fullDescription: "Comprehensive training in cross-cultural missions, urban evangelism, digital evangelism, and humanitarian outreach. Students learn practical skills for sharing the gospel in diverse contexts and serving communities effectively.",
    duration: "1-2 Years",
    format: "Certificate/Diploma",
    targetAudience: "Missionaries, evangelists",
    icon: "globe",
  },
  {
    id: "7",
    slug: "media-communication",
    name: "Christian Media, Communication & Digital Ministry Program",
    shortDescription: "Training in content creation, media ethics, storytelling, social media ministry, and church communications.",
    fullDescription: "This program provides training in content creation, media ethics, storytelling, social media ministry, and church communications. Students learn to use modern media tools to effectively communicate the gospel and build digital ministry platforms.",
    duration: "1 Year",
    format: "Certificate/Diploma",
    targetAudience: "Content creators, media professionals, church communicators",
    icon: "video",
  },
  {
    id: "8",
    slug: "youth-mentorship",
    name: "Youth Mentorship & Purpose Discovery Academy",
    shortDescription: "A program helping young believers discover their calling, build character, and understand kingdom assignment early in life.",
    fullDescription: "A specialized program designed to help young believers discover their calling, build strong character, and understand their kingdom assignment early in life. Through mentorship and practical training, students develop a clear sense of purpose and direction.",
    duration: "6 Months - 1 Year",
    format: "Certificate",
    targetAudience: "Young believers, teenagers, young adults",
    icon: "sparkles",
  },
  {
    id: "9",
    slug: "deliverance-warfare",
    name: "School of Deliverance & Spiritual Warfare",
    shortDescription: "Biblically grounded training on deliverance ministry, spiritual authority, and breaking strongholds responsibly and safely.",
    fullDescription: "Biblically grounded training on deliverance ministry, spiritual authority, and breaking strongholds responsibly and safely. Students learn the principles and practices of deliverance ministry while maintaining safety and biblical integrity.",
    duration: "6 Months",
    format: "Certificate",
    targetAudience: "Ministers, counselors, deliverance workers",
    icon: "sword",
  },
  {
    id: "10",
    slug: "entrepreneurship-innovation",
    name: "Christian Entrepreneurship & Kingdom Innovation Program",
    shortDescription: "Equipping believers to build businesses, nonprofits, and community-impact projects rooted in kingdom principles.",
    fullDescription: "This program equips believers to build businesses, nonprofits, and community-impact projects rooted in kingdom principles. Students learn to integrate faith and business, creating enterprises that honor God and serve communities.",
    duration: "1 Year",
    format: "Certificate/Diploma",
    targetAudience: "Entrepreneurs, business leaders, innovators",
    icon: "lightbulb",
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find(program => program.slug === slug);
}


