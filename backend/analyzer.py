import json
import os
import traceback
from groq import Groq


def generate_review(pr_data):
    """Generate code review using Groq API."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not found in environment variables")

    try:
        client = Groq()
    except Exception as e:
        print(f"Error creating Groq client: {str(e)}")
        traceback.print_exc()
        raise Exception(f"Failed to initialize Groq client: {str(e)}")

    # Build the prompt
    prompt = f"""You are a senior software engineer doing a code review. Analyze this pull request and respond in valid JSON only.

PR Title: {pr_data['title']}
Author: {pr_data['author']}
Files changed: {', '.join(pr_data['file_names']) if pr_data['file_names'] else 'N/A'}
Additions: {pr_data['additions']} Deletions: {pr_data['deletions']}

Diff:
{pr_data['diff_text']}

Respond with exactly this JSON structure:
{{
  "plain_summary": "2-3 sentences explaining what this PR does in plain English",
  "risks": [
    "specific risk or bug 1",
    "specific risk or bug 2",
    "specific risk or bug 3"
  ],
  "suggestions": [
    {{
      "title": "short title",
      "detail": "specific explanation",
      "code": "code fix or null"
    }}
  ],
  "risk_score": 45
}}

Risk score 0-100. Base it on: number of files changed, presence of error handling, security patterns, complexity of changes.
Respond with JSON only. No markdown. No explanation."""

    try:
        message = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=1024,
            temperature=0.5
        )
        response_text = message.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq API error: {str(e)}")
        traceback.print_exc()
        raise Exception(f"Groq API error: {str(e)}")

    # Parse JSON response
    try:
        review = json.loads(response_text)
    except json.JSONDecodeError:
        # Try to extract JSON from response if it contains markdown
        try:
            json_match = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_match != -1 and json_end > json_match:
                review = json.loads(response_text[json_match:json_end])
            else:
                raise ValueError("No valid JSON found in response")
        except Exception as parse_err:
            raise Exception(f"Could not parse Groq response as JSON: {str(parse_err)}")

    # Add verdict based on risk_score
    risk_score = review.get("risk_score", 50)
    if risk_score < 30:
        verdict = "SHIP IT"
    elif risk_score <= 70:
        verdict = "REVIEW CAREFULLY"
    else:
        verdict = "DO NOT MERGE"

    # Build final response
    return {
        "plain_summary": review.get("plain_summary", ""),
        "risks": review.get("risks", []),
        "suggestions": review.get("suggestions", []),
        "risk_score": risk_score,
        "verdict": verdict
    }
