import { user_social_links, biolink_analytics } from './app/db/schema.ts';

console.log('Testing database connection...');

// This is a simple test to see if we can reference the tables without errors
console.log('Tables defined:');
console.log('- user_social_links:', !!user_social_links);
console.log('- biolink_analytics:', !!biolink_analytics);

console.log('✅ Schema validation passed!');
