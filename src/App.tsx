import {
  // Basic table examples
  FullFeaturedTableExample,
  SimpleTableExample,
  ActionButtonTableExample,
  TypeSafeTableExample,
  // Async table examples
  ServerSideTableExample,
  ClientSideTableExample,
  CustomAsyncTableExample,
  // Pokemon table examples
  PokemonServerSideExample,
  PokemonClientSideExample,
  // Pokemon Suspense examples
  PokemonSuspenseExample,
  PokemonRowSuspenseExample,
  PokemonPageSuspenseExample,
} from "./components/examples";
import "./components/table/table.css";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <div className="container">
        <h1>Headless Table Demo</h1>

        {/* Example 1: Full-featured table */}
        <section>
          <h2>Full-featured Table</h2>
          <p>
            This table includes sorting, pagination, filtering, and custom cell
            rendering.
          </p>

          <FullFeaturedTableExample />
        </section>

        {/* Example 2: Simple table with just the hook */}
        <section>
          <h2>Custom Implementation with useTable Hook</h2>
          <p>
            This shows how to use the useTable hook directly for custom
            implementations.
          </p>

          <SimpleTableExample />
        </section>

        {/* Example 3: Async data examples */}
        <section>
          <h2>Async Data Examples</h2>

          <h3>Server-side Operations</h3>
          <p>
            This example shows server-side pagination, sorting, and filtering.
          </p>
          <ServerSideTableExample />

          <h3>Client-side Operations</h3>
          <p>
            This example loads all data once and performs operations on the
            client.
          </p>
          <ClientSideTableExample />

          <h3>Custom Async Implementation</h3>
          <p>This example shows manual async data management.</p>
          <CustomAsyncTableExample />
        </section>

        {/* Example 4: Pokemon API examples */}
        <section>
          <h2>🐱 Pokemon API Examples</h2>
          <p>
            Real-world examples using the Pokemon API to demonstrate async
            loading, error handling, and different data management strategies.
          </p>

          <h3>Pokemon with Server-Side Pagination</h3>
          <p>
            Loads Pokemon data page by page with real network delays. Try
            searching for Pokemon names or types like "fire" or "water".
          </p>
          <PokemonServerSideExample />

          <h3>Load All Pokemon (Generation 1)</h3>
          <p>
            Loads all 151 original Pokemon at once. This demonstrates longer
            loading times and client-side operations after data is loaded.
            Toggle shiny sprites!
          </p>
          <PokemonClientSideExample />
        </section>

        {/* Example 5: Pokemon with Suspense */}
        <section>
          <h2>⚡ Pokemon with Suspense</h2>
          <p>
            Modern React Suspense example with declarative loading states. The
            component suspends while fetching data, showing a beautiful
            fallback.
          </p>

          <h3>Suspense-based Pokemon Table</h3>
          <p>
            Uses React 18's Suspense and the 'use' hook for clean, declarative
            loading. Change the Pokemon count to see different loading times!
          </p>
          <PokemonSuspenseExample />
        </section>

        {/* Example 6: Pokemon with Row-Level Suspense */}
        <section>
          <h2>🎭 Pokemon with Row-Level Suspense</h2>
          <p>
            Advanced Suspense example where each table row suspends
            individually! Watch as Pokemon appear one by one with staggered
            loading times.
          </p>

          <h3>Individual Row Suspense</h3>
          <p>
            Each Pokemon row has its own Suspense boundary and skeleton loader.
            This creates a beautiful staggered loading effect where rows appear
            as their data loads. Perfect for scenarios where individual items
            have different loading times!
          </p>
          <PokemonRowSuspenseExample />
        </section>

        {/* Example 7: Pokemon with Page-Level Suspense */}
        <section>
          <h2>📄 Pokemon with Page-Level Suspense</h2>
          <p>
            Efficient page-based loading where only the current page's Pokemon
            are fetched! This is perfect for large datasets where you don't want
            to load everything at once.
          </p>

          <h3>Page-Only Loading</h3>
          <p>
            Navigate between pages to see fresh loading animations for each
            page. Each page loads independently with row-level suspense, but
            only fetches the Pokemon you actually need to see. Much more
            efficient than loading all data upfront!
          </p>
          <PokemonPageSuspenseExample />
        </section>

        {/* Example 8: Table with Action Buttons */}
        <section>
          <h2>🎯 Table with Action Buttons</h2>
          <p>
            This example shows a table with action buttons in the last column
            instead of clickable rows. Each row has Edit, Delete, and View
            buttons for different actions.
          </p>

          <h3>User Management Table</h3>
          <p>
            Click the action buttons to perform operations on individual users.
            This pattern is common in admin panels and data management
            interfaces.
          </p>
          <ActionButtonTableExample />
        </section>

        {/* Example 9: Type-Safe Table with Deep Key Access */}
        <section>
          <h2>🔒 Type-Safe Table with Deep Key Access</h2>
          <p>
            This example demonstrates enhanced type safety with deep nested
            object access, custom sort functions, and full TypeScript inference.
          </p>

          <h3>Company Data with Complex Nested Structure</h3>
          <p>
            Explore type-safe access to nested properties like "employees.total"
            and "headquarters.address.city". Notice how your IDE provides
            autocomplete for all valid deep keys!
          </p>
          <TypeSafeTableExample />
        </section>
      </div>
    </div>
  );
};

export default App;
