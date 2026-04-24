import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from github_parser import get_pr_data
from analyzer import generate_review


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all origins
CORS(app, origins="*")


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """Analyze a GitHub PR and return a review."""
    try:
        # Get PR URL from request
        data = request.get_json()
        if not data or "pr_url" not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'pr_url' in request body"
            }), 400

        pr_url = data["pr_url"].strip()

        # Fetch PR data from GitHub
        try:
            pr_data = get_pr_data(pr_url)
        except Exception as e:
            return jsonify({
                "success": False,
                "error": "Could not fetch PR. Make sure it is a public repository."
            }), 400

        # Generate review using Groq
        try:
            review = generate_review(pr_data)
        except Exception as e:
            return jsonify({
                "success": False,
                "error": f"Failed to generate review: {str(e)}"
            }), 500

        # Build response
        response = {
            "success": True,
            "pr_title": pr_data["title"],
            "pr_author": pr_data["author"],
            "files_changed": pr_data["files_changed"],
            "additions": pr_data["additions"],
            "deletions": pr_data["deletions"],
            "plain_summary": review["plain_summary"],
            "risks": review["risks"],
            "suggestions": review["suggestions"],
            "risk_score": review["risk_score"],
            "verdict": review["verdict"]
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }), 500


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    # Run on port 5000
    app.run(debug=True, host="0.0.0.0", port=5000)
