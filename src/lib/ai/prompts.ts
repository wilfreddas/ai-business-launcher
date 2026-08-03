export function websitePrompt(
  businessName: string,
  description: string
) {
  return `
Create a professional mobile-friendly website.

Business:
${businessName}

Description:
${description}

Return:
- headline
- sections
- call to action
`;
}