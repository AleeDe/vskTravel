// Content moderation & validation for services/products before publishing
// Uses simple rule-based checks + optional external API

interface ValidationRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  type: "service" | "product";
}

interface ValidationResponse {
  isValid: boolean;
  score: number; // 0-100 (higher = safer)
  issues: string[];
  warnings: string[];
}

function validateContent(
  text: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check length
  if (text.length < 10) {
    issues.push("Description too short (min 10 chars)");
  }
  if (text.length > 5000) {
    issues.push("Description too long (max 5000 chars)");
  }

  // Check for spam patterns
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|nigerian prince)\b/gi,
    /https?:\/\/[^\s]+/g, // URLs (usually spam)
    /(?:©|®|™)/g, // Excessive brand symbols
  ];

  spamPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      issues.push("Potential spam detected");
    }
  });

  // Check for excessive caps
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.5) {
    issues.push("Too much uppercase text");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: ValidationRequest = await req.json();
    const { title, description, category, price, type } = body;

    const issues: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Title validation
    if (!title || title.length < 5) {
      issues.push("Title must be at least 5 characters");
      score -= 25;
    }
    if (title.length > 120) {
      issues.push("Title too long (max 120 chars)");
      score -= 15;
    }

    // Description validation
    const descValidation = validateContent(description || "");
    if (!descValidation.valid) {
      issues.push(...descValidation.issues);
      score -= 20;
    }

    // Price validation
    if (price < 100) {
      warnings.push("Price seems very low for this category");
      score -= 5;
    }
    if (price > 5000000) {
      issues.push("Price unreasonably high");
      score -= 30;
    }

    // Category validation
    const validCategories = [
      "flights",
      "hotels",
      "tour-packages",
      "visa-assistance",
      "car-rentals",
      "luggage",
      "travel-gear",
      "accessories",
      "electronics",
    ];
    if (!validCategories.includes(category.toLowerCase())) {
      issues.push("Invalid category");
      score -= 25;
    }

    // Type-specific checks
    if (type === "service" && price < 1000) {
      warnings.push("Service pricing unusually low");
      score -= 10;
    }

    score = Math.max(0, score);

    const response: ValidationResponse = {
      isValid: issues.length === 0,
      score,
      issues,
      warnings,
    };

    // If score too low, require manual review
    if (score < 40) {
      response.isValid = false;
      issues.push("Content requires manual review by moderator");
    }

    return new Response(JSON.stringify(response), {
      status: response.isValid ? 200 : 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[Validate Listing]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
