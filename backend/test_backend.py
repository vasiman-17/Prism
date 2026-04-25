"""Test script to verify backend fixes"""
import sys

def test_syntax():
    """Test Python syntax of all backend files"""
    print("Testing Python syntax...")
    files = ['app.py', 'analyzer.py', 'github_parser.py']
    for file in files:
        try:
            with open(file, 'r') as f:
                compile(f.read(), file, 'exec')
            print(f"✓ {file} - Syntax OK")
        except SyntaxError as e:
            print(f"✗ {file} - Syntax Error: {e}")
            return False
    return True

def test_imports():
    """Test if all imports are available"""
    print("\nTesting imports...")
    try:
        import flask
        print("✓ flask")
        import flask_cors
        print("✓ flask_cors")
        import requests
        print("✓ requests")
        import dotenv
        print("✓ python-dotenv")
        try:
            import groq
            print("✓ groq")
        except ImportError:
            print("⚠ groq (may need to install)")
        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False

def test_github_parser():
    """Test GitHub URL parsing"""
    print("\nTesting GitHub URL parser...")
    from github_parser import parse_pr_url
    
    test_urls = [
        "https://github.com/owner/repo/pull/123",
        "http://github.com/owner/repo/pull/456",
        "https://www.github.com/owner/repo/pull/789",
        "github.com/owner/repo/pull/999"
    ]
    
    for url in test_urls:
        try:
            owner, repo, pr_num = parse_pr_url(url)
            print(f"✓ Parsed: {url} -> {owner}/{repo}/#{pr_num}")
        except Exception as e:
            print(f"✗ Failed to parse: {url} - {e}")
            return False
    return True

def test_groq_client():
    """Test Groq client initialization with API key"""
    print("\nTesting Groq client initialization...")
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("⚠ GROQ_API_KEY not found in .env file")
        print("  This is expected if you haven't set it up yet")
        return True
    
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        print("✓ Groq client initialized successfully")
        return True
    except Exception as e:
        print(f"✗ Groq client error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Backend Test Suite")
    print("=" * 50)
    
    results = []
    results.append(("Syntax", test_syntax()))
    results.append(("Imports", test_imports()))
    results.append(("GitHub Parser", test_github_parser()))
    results.append(("Groq Client", test_groq_client()))
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print("=" * 50)
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(result for _, result in results)
    print("=" * 50)
    if all_passed:
        print("All tests passed! ✓")
        sys.exit(0)
    else:
        print("Some tests failed! ✗")
        sys.exit(1)
