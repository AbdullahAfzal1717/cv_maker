import crypto from "crypto";

const CV_KEYWORDS = [
  "name",
  "experience",
  "education",
  "skills",
  "company",
  "project",
  "degree",
  "university",
  "job",
  "developer",
  "manager",
  "designer",
  "work",
  "worked",
  "school",
  "resume",
  "cv",
];

const FIELD_LIMITS = {
  fullName: { maxLength: 30 },
  jobTitle: { maxLength: 50 },
  email: { maxLength: 254 },
  phone: { minLength: 9, maxLength: 12 },
  address: { maxLength: 150 },
  linkedin: { maxLength: 200 },
  institution: { maxLength: 80 },
  degree: { maxLength: 80 },
  grade: { maxLength: 10 },
  company: { maxLength: 80 },
  role: { maxLength: 80 },
  experienceDescription: { maxLength: 600 },
  projectTitle: { maxLength: 80 },
  projectDescription: { maxLength: 500 },
  projectLink: { maxLength: 300 },
  tag: { maxLength: 100 },
};

const MAX_TAGS_PER_SECTION = 20;
const MAX_ARRAY_ENTRIES = 15;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_ALLOWED_CHARS = /[^a-zA-Z\s.]/g;
const GRADE_ALLOWED_CHARS = /[^a-zA-Z0-9./\s-]/g;
const DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

function truncate(str: string | undefined, maxLength: number): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLength);
}

function sanitizePhone(rawPhone: unknown): string {
  if (!rawPhone || typeof rawPhone !== "string") return "";
  const digitsOnly = rawPhone.replace(/[^\d+]/g, "");
  if (
    digitsOnly.length < FIELD_LIMITS.phone.minLength ||
    digitsOnly.length > FIELD_LIMITS.phone.maxLength
  ) {
    return "";
  }
  return digitsOnly;
}

function sanitizeDate(rawDate: unknown): string {
  if (!rawDate || typeof rawDate !== "string") return "";
  if (rawDate.trim().toLowerCase() === "present") return "Present";
  return DATE_REGEX.test(rawDate.trim()) ? rawDate.trim() : "";
}

function sanitizeEmail(rawEmail: unknown): string {
  const trimmed = truncate(
    (rawEmail || "").toString().trim(),
    FIELD_LIMITS.email.maxLength,
  );
  return EMAIL_REGEX.test(trimmed) ? trimmed : "";
}

function sanitizeTagArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    .slice(0, MAX_TAGS_PER_SECTION)
    .map((t) => truncate(t.trim(), FIELD_LIMITS.tag.maxLength));
}

export function sanitizeExtractedResumeData(raw: Record<string, unknown>) {
  const droppedFields: string[] = [];
  const personalInfo = (raw.personalInfo || {}) as Record<string, unknown>;

  const phone = sanitizePhone(personalInfo.phone);
  if (personalInfo.phone && !phone) droppedFields.push("phone");

  const email = sanitizeEmail(personalInfo.email);
  if (personalInfo.email && !email) droppedFields.push("email");

  const data = {
    personalInfo: {
      fullName: truncate(
        ((personalInfo.fullName as string) || "").replace(
          NAME_ALLOWED_CHARS,
          "",
        ),
        FIELD_LIMITS.fullName.maxLength,
      ),
      email,
      phone,
      jobTitle: truncate(
        (personalInfo.jobTitle as string) || "",
        FIELD_LIMITS.jobTitle.maxLength,
      ),
      address: truncate(
        (personalInfo.address as string) || "",
        FIELD_LIMITS.address.maxLength,
      ),
      linkedin: truncate(
        (personalInfo.linkedin as string) || "",
        FIELD_LIMITS.linkedin.maxLength,
      ),
      profilePhoto: "",
    },
    objective: ((raw.objective as string) || "").trim(),
    education: (
      (Array.isArray(raw.education) ? raw.education : []) as Record<
        string,
        unknown
      >[]
    )
      .slice(0, MAX_ARRAY_ENTRIES)
      .map((e) => ({
        id: crypto.randomUUID(),
        institution: truncate(
          e.institution as string,
          FIELD_LIMITS.institution.maxLength,
        ),
        degree: truncate(e.degree as string, FIELD_LIMITS.degree.maxLength),
        grade: truncate(
          ((e.grade as string) || "").replace(GRADE_ALLOWED_CHARS, ""),
          FIELD_LIMITS.grade.maxLength,
        ),
        startDate: sanitizeDate(e.startDate),
        endDate: sanitizeDate(e.endDate),
      })),
    experience: (
      (Array.isArray(raw.experience) ? raw.experience : []) as Record<
        string,
        unknown
      >[]
    )
      .slice(0, MAX_ARRAY_ENTRIES)
      .map((e) => ({
        id: crypto.randomUUID(),
        company: truncate(e.company as string, FIELD_LIMITS.company.maxLength),
        role: truncate(e.role as string, FIELD_LIMITS.role.maxLength),
        startDate: sanitizeDate(e.startDate),
        endDate: sanitizeDate(e.endDate),
        description: truncate(
          e.description as string,
          FIELD_LIMITS.experienceDescription.maxLength,
        ),
      })),
    projects: (
      (Array.isArray(raw.projects) ? raw.projects : []) as Record<
        string,
        unknown
      >[]
    )
      .slice(0, MAX_ARRAY_ENTRIES)
      .map((p) => ({
        id: crypto.randomUUID(),
        title: truncate(p.title as string, FIELD_LIMITS.projectTitle.maxLength),
        description: truncate(
          p.description as string,
          FIELD_LIMITS.projectDescription.maxLength,
        ),
        technologies: sanitizeTagArray(p.technologies),
        link: truncate(p.link as string, FIELD_LIMITS.projectLink.maxLength),
      })),
    additional: {
      skills: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.skills,
      ),
      languages: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.languages,
      ),
      interests: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.interests,
      ),
      software: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.software,
      ),
      certificates: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.certificates,
      ),
      publications: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.publications,
      ),
      references: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.references,
      ),
      socialLinks: sanitizeTagArray(
        (raw.additional as Record<string, unknown>)?.socialLinks,
      ),
    },
  };

  return { data, droppedFields };
}

export function isSessionVague(
  messages: Array<{ role: string; text: string }>,
): boolean {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return true;

  const combinedText = userMessages.map((m) => m.text.toLowerCase()).join(" ");
  const wordCount = combinedText
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const hasKeyword = CV_KEYWORDS.some((keyword) =>
    combinedText.includes(keyword),
  );

  return wordCount <= 3 && !hasKeyword;
}

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash",
];

async function callGeminiAPI(
  systemInstruction: string | null,
  messages: Array<{ role: string; text: string }>,
  isJsonMode = false,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const contents = messages
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }],
    }))
    .filter((msg) => msg.parts[0].text);

  const payload: Record<string, unknown> = {
    contents,
    system_instruction: systemInstruction
      ? { parts: [{ text: systemInstruction }] }
      : undefined,
    generationConfig: isJsonMode
      ? { responseMimeType: "application/json" }
      : {},
  };

  for (const model of MODELS) {
    let attempt = 0;

    while (attempt < 2) {
      attempt++;
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
          }
          throw new Error("Invalid response format from Gemini");
        }

        if (response.status === 429 || response.status >= 500) {
          if (attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          } else {
            break;
          }
        } else {
          const errorText = await response.text();
          throw new Error(
            `Gemini API Error: ${response.status} - ${errorText}`,
          );
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Gemini API Error")
        ) {
          throw error;
        }
        if (attempt === 2) {
          console.error(`Model ${model} failed after 2 attempts:`, error);
        }
      }
    }
  }

  throw new Error("All Gemini models in fallback chain failed.");
}
export async function generateChatResponse(
  messages: Array<{ role: string; text: string }>,
): Promise<string> {
  const systemPrompt =
    "You are an expert AI Resume Assistant. Help the user build their resume. Ask one question at a time to gather missing info. Never invent facts, jobs, or education not explicitly stated by the user. Keep responses concise and encouraging. If the user has shared enough about their background, proactively suggest and write a concise professional objective/summary based only on what they've explicitly stated — do not ask the user to write their own objective.";
  return await callGeminiAPI(systemPrompt, messages, false);
}

export async function generateSessionTitle(
  messageText: string,
): Promise<string | null> {
  try {
    const systemPrompt =
      "Generate a concise 3-6 word professional title summarizing this person's resume/career focus based on their message. Return only the title text, no quotes, no punctuation at the end.";
    const messages = [{ role: "user", text: messageText }];
    return await callGeminiAPI(systemPrompt, messages, false);
  } catch (error) {
    return null;
  }
}

export async function generateCVExtraction(
  messages: Array<{ role: string; text: string }>,
) {
  const systemPrompt = `You are a strict data extraction AI. Extract the user's resume details from the chat history into a valid JSON object matching this exact schema:
    {
      "personalInfo": {
        "fullName": "", "email": "", "phone": "", "jobTitle": "",
        "address": "", "linkedin": ""
      },
      "objective": "",
      "education": [
        { "institution": "", "degree": "", "grade": "", "startDate": "MM/YYYY", "endDate": "MM/YYYY or Present" }
      ],
      "experience": [
        { "company": "", "role": "", "startDate": "MM/YYYY", "endDate": "MM/YYYY or Present", "description": "" }
      ],
      "projects": [
        { "title": "", "description": "", "technologies": [], "link": "" }
      ],
      "additional": {
        "skills": [], "languages": [], "interests": [], "software": [],
        "certificates": [], "publications": [], "references": [], "socialLinks": []
      }
    }
    Rules:
    - Only include facts explicitly stated by the user. Do NOT invent data.
    - Write the objective field yourself as a polished 2-3 sentence professional summary based ONLY on facts explicitly stated in the conversation — never leave it as an empty string if the user has provided any usable background information, and never invent facts not stated.
    - For phone numbers: only include it if the user explicitly stated actual digits that look like a real phone number. Do not guess, pad, truncate, or reformat digits to fit a length. If you are not confident it's a real number, return an empty string rather than a best-effort guess.
    - For each experience and project entry's description, rewrite it as a polished, professional 1-3 sentence description using strong action verbs and clear impact — based ONLY on what the user explicitly stated. Do not invent achievements, metrics, or responsibilities the user did not mention. If the user gave only a rough phrase (e.g. 'built the login page'), expand it into a complete, professional sentence without adding new facts (e.g. 'Developed and implemented the user login and authentication interface.').
    - technologies is an array of strings.
    - startDate and endDate must be in "MM/YYYY" format (e.g. "06/2022"), zero-padded month, or the literal word "Present" for an ongoing endDate. If the user only gave a year, use "01/YYYY". If a date wasn't mentioned at all, leave it as an empty string — never guess a date.
    - Do NOT include an "id" field — it is assigned after parsing.
    - Do NOT include profilePhoto — it is never set by the model.
    - Return ONLY valid JSON with no markdown fences.`;

  const jsonStr = await callGeminiAPI(systemPrompt, messages, true);
  try {
    const cleaned = jsonStr.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return sanitizeExtractedResumeData(parsed);
  } catch (err) {
    throw new Error("Failed to parse Gemini output as JSON");
  }
}
