'use client';

import { useState } from 'react';
import {
  Book,
  Code,
  Key,
  Users,
  Shield,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['authentication']);

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const endpoints = [
    {
      id: 'authentication',
      title: 'Authentication',
      icon: Key,
      description: 'All API requests require authentication using an API key.',
      content: `All API requests must include your API key in the Authorization header:

\`\`\`bash
Authorization: Bearer YOUR_API_KEY
\`\`\`

You can generate API keys from your dashboard.`,
      example: `curl -X GET "https://api.applyo.com/v1/candidates/lookup" \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json"`,
    },
    {
      id: 'lookup',
      title: 'Candidate Lookup',
      icon: Users,
      description: 'Search for candidates by email address.',
      content: `**Endpoint:** \`GET /api/v1/candidates/lookup\`

**Query Parameters:**
- \`email\` (required) - The candidate's email address

**Response:**
- Returns candidate ID if found
- Returns consent status
- Returns profile data if consent is granted`,
      example: `curl -X GET "https://api.applyo.com/v1/candidates/lookup?email=john@example.com" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response
{
  "success": true,
  "data": {
    "candidateId": "cand_123abc",
    "consentStatus": "granted",
    "profile": {
      "fullName": "John Doe",
      "email": "john@example.com",
      ...
    }
  }
}`,
    },
    {
      id: 'consent',
      title: 'Request Consent',
      icon: Shield,
      description: 'Request permission to access candidate data.',
      content: `**Endpoint:** \`POST /api/v1/consent/request\`

**Request Body:**
- \`candidateEmail\` (required) - The candidate's email
- \`requestedFields\` (required) - Array of fields to request
- \`purpose\` (optional) - Reason for data access

**Available Fields:**
\`fullName\`, \`email\`, \`phone\`, \`location\`, \`headline\`, \`about\`, \`education\`, \`experience\`, \`skills\`, \`documents\``,
      example: `curl -X POST "https://api.applyo.com/v1/consent/request" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "candidateEmail": "john@example.com",
    "requestedFields": ["fullName", "email", "experience", "skills"],
    "purpose": "Review for Software Engineer position"
  }'

# Response
{
  "success": true,
  "data": {
    "consentId": "cons_xyz789",
    "status": "pending",
    "expiresAt": "2024-02-15T00:00:00Z"
  }
}`,
    },
    {
      id: 'profile',
      title: 'Get Full Profile',
      icon: Users,
      description: 'Retrieve complete candidate profile with consent.',
      content: `**Endpoint:** \`GET /api/v1/candidates/:id/profile\`

**Path Parameters:**
- \`id\` (required) - The candidate ID

**Requirements:**
- Valid consent must be granted
- Only returns fields the candidate consented to share`,
      example: `curl -X GET "https://api.applyo.com/v1/candidates/cand_123abc/profile" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response
{
  "success": true,
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "experience": [
      {
        "company": "Tech Corp",
        "role": "Senior Engineer",
        "startDate": "2020-01-01",
        "endDate": null
      }
    ],
    "skills": ["JavaScript", "React", "Node.js"]
  }
}`,
    },
    {
      id: 'webhook',
      title: 'Webhooks',
      icon: Code,
      description: 'Receive real-time updates about consent changes.',
      content: `**Webhook Events:**
- \`consent.granted\` - Candidate approved your request
- \`consent.denied\` - Candidate denied your request
- \`consent.revoked\` - Candidate revoked previously granted consent

**Webhook Payload:**
All webhook payloads include a signature header for verification.`,
      example: `// Example webhook payload
{
  "event": "consent.granted",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "consentId": "cons_xyz789",
    "candidateId": "cand_123abc",
    "grantedFields": ["fullName", "email", "experience"]
  }
}

// Verify webhook signature
const crypto = require('crypto');
const signature = req.headers['x-applyo-signature'];
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature === expectedSignature) {
  // Valid webhook
}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
        <p className="text-gray-600">
          Integrate ApplyO with your application to access candidate profiles
        </p>
      </div>

      {/* Quick Start */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Book className="w-5 h-5 mr-2 text-primary-600" />
          Quick Start
        </h2>
        <p className="mt-2 text-gray-600">
          Get started with the ApplyO API in three simple steps:
        </p>
        <ol className="mt-4 space-y-3">
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <span className="text-gray-700">
              Generate an API key from your{' '}
              <a href="/company/dashboard/api-keys" className="text-primary-600 hover:underline">
                API Keys
              </a>{' '}
              page
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <span className="text-gray-700">
              Look up candidates by email to check if they have an ApplyO profile
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <span className="text-gray-700">
              Request consent and access candidate data once approved
            </span>
          </li>
        </ol>
      </div>

      {/* Base URL */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
          <code className="text-green-400">https://api.applyo.com/v1</code>
          <button
            onClick={() => copyCode('https://api.applyo.com/v1', 'baseurl')}
            className="text-gray-400 hover:text-white"
          >
            {copiedCode === 'baseurl' ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Rate Limits</h3>
        <p className="text-gray-600 mb-4">
          API requests are rate limited based on your plan:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-700">Plan</th>
                <th className="text-left py-2 text-gray-700">Requests/min</th>
                <th className="text-left py-2 text-gray-700">Monthly Quota</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b">
                <td className="py-2">Starter</td>
                <td className="py-2">60</td>
                <td className="py-2">1,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Pro</td>
                <td className="py-2">120</td>
                <td className="py-2">10,000</td>
              </tr>
              <tr>
                <td className="py-2">Enterprise</td>
                <td className="py-2">Custom</td>
                <td className="py-2">Custom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">API Endpoints</h2>

        {endpoints.map((endpoint) => (
          <div key={endpoint.id} className="card overflow-hidden">
            <button
              onClick={() => toggleSection(endpoint.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <endpoint.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{endpoint.title}</h3>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                </div>
              </div>
              {expandedSections.includes(endpoint.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.includes(endpoint.id) && (
              <div className="px-6 pb-6 border-t">
                <div className="pt-4 prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-600 text-sm">
                    {endpoint.content}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Example</span>
                    <button
                      onClick={() => copyCode(endpoint.example, endpoint.id)}
                      className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                    >
                      {copiedCode === endpoint.id ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
                      <code>{endpoint.example}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error Codes */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Error Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-700">Code</th>
                <th className="text-left py-2 text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">400</code></td>
                <td className="py-2">Bad Request - Invalid parameters</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">401</code></td>
                <td className="py-2">Unauthorized - Invalid or missing API key</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">403</code></td>
                <td className="py-2">Forbidden - Consent not granted</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">404</code></td>
                <td className="py-2">Not Found - Resource doesn&apos;t exist</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">429</code></td>
                <td className="py-2">Too Many Requests - Rate limit exceeded</td>
              </tr>
              <tr>
                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">500</code></td>
                <td className="py-2">Internal Server Error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SDK Links */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">SDKs & Libraries</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="#"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🟨</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">JavaScript/TypeScript</p>
              <p className="text-sm text-gray-500">npm install @applyo/sdk</p>
            </div>
          </a>
          <a
            href="#"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🐍</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Python</p>
              <p className="text-sm text-gray-500">pip install applyo</p>
            </div>
          </a>
          <a
            href="#"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">💎</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Ruby</p>
              <p className="text-sm text-gray-500">gem install applyo</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
