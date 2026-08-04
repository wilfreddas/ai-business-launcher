export function websitePrompt(
  businessName: string,
  description: string,
  type: string
) {

return `
You are an expert website designer.

Create a website blueprint.

Business:
${businessName}

Type:
${type}

Description:
${description}


Return ONLY JSON.

Format:

{
 "template": "restaurant or service",
 "sections": [
   "hero",
   "menu",
   "gallery",
   "reviews",
   "location",
   "contact"
 ],
 "theme": {
   "style": "modern",
   "primaryColor": "#000000"
 }
}

Choose sections based on the business.
`;
}