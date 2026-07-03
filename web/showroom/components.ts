export interface ShowroomComponent {
  slug: string;
  name: string;
  group:
    | "Actions"
    | "Data"
    | "Navigation"
    | "Feedback"
    | "Data input"
    | "Layout"
    | "Mockup";
  example: string;
}

const names = [
  [
    "button",
    "Button",
    "Actions",
    '<button class="btn btn-primary">Save</button>',
  ],
  [
    "dropdown",
    "Dropdown",
    "Actions",
    '<div class="dropdown"><button class="btn">Menu</button></div>',
  ],
  [
    "modal",
    "Modal",
    "Actions",
    '<button class="btn" onclick="demo.showModal()">Open</button>',
  ],
  [
    "swap",
    "Swap",
    "Actions",
    '<label class="swap"><input type="checkbox"><span class="swap-on">On</span><span class="swap-off">Off</span></label>',
  ],
  [
    "theme-controller",
    "Theme Controller",
    "Actions",
    '<input type="checkbox" class="toggle theme-controller" value="dark">',
  ],
  [
    "accordion",
    "Accordion",
    "Data",
    '<div class="collapse collapse-arrow bg-base-100"><input type="radio"><div class="collapse-title">Details</div></div>',
  ],
  [
    "avatar",
    "Avatar",
    "Data",
    '<div class="avatar placeholder"><div class="bg-neutral text-neutral-content w-12 rounded-full"><span>HX</span></div></div>',
  ],
  ["badge", "Badge", "Data", '<span class="badge badge-primary">Active</span>'],
  [
    "calendar",
    "Calendar",
    "Data",
    '<div class="rounded-box border p-4">Calendar slot</div>',
  ],
  [
    "card",
    "Card",
    "Data",
    '<div class="card bg-base-100 shadow"><div class="card-body"><h2 class="card-title">Card</h2></div></div>',
  ],
  [
    "carousel",
    "Carousel",
    "Data",
    '<div class="carousel"><div class="carousel-item w-full">Slide</div></div>',
  ],
  [
    "chat",
    "Chat",
    "Data",
    '<div class="chat chat-start"><div class="chat-bubble">Hello</div></div>',
  ],
  [
    "collapse",
    "Collapse",
    "Data",
    '<div class="collapse bg-base-100"><input type="checkbox"><div class="collapse-title">Open</div></div>',
  ],
  [
    "countdown",
    "Countdown",
    "Data",
    '<span class="countdown"><span style="--value:42"></span></span>',
  ],
  [
    "diff",
    "Diff",
    "Data",
    '<div class="diff aspect-video"><div class="diff-item-1">Before</div><div class="diff-item-2">After</div></div>',
  ],
  ["kbd", "Kbd", "Data", '<kbd class="kbd">⌘</kbd>'],
  [
    "list",
    "List",
    "Data",
    '<ul class="list bg-base-100"><li class="list-row">Item</li></ul>',
  ],
  [
    "stat",
    "Stat",
    "Data",
    '<div class="stat"><div class="stat-title">Users</div><div class="stat-value">31K</div></div>',
  ],
  ["status", "Status", "Data", '<span class="status status-success"></span>'],
  [
    "table",
    "Table",
    "Data",
    '<table class="table"><tbody><tr><td>Row</td></tr></tbody></table>',
  ],
  [
    "timeline",
    "Timeline",
    "Data",
    '<ul class="timeline"><li><div class="timeline-middle">●</div></li></ul>',
  ],
  [
    "breadcrumbs",
    "Breadcrumbs",
    "Navigation",
    '<div class="breadcrumbs"><ul><li>Home</li><li>Page</li></ul></div>',
  ],
  [
    "dock",
    "Dock",
    "Navigation",
    '<div class="dock"><button>Home</button></div>',
  ],
  ["link", "Link", "Navigation", '<a class="link link-primary">Link</a>'],
  [
    "menu",
    "Menu",
    "Navigation",
    '<ul class="menu bg-base-100"><li><a>Item</a></li></ul>',
  ],
  [
    "navbar",
    "Navbar",
    "Navigation",
    '<div class="navbar bg-base-100"><a class="btn btn-ghost text-xl">App</a></div>',
  ],
  [
    "pagination",
    "Pagination",
    "Navigation",
    '<div class="join"><button class="join-item btn">1</button></div>',
  ],
  [
    "steps",
    "Steps",
    "Navigation",
    '<ul class="steps"><li class="step step-primary">Start</li></ul>',
  ],
  [
    "tab",
    "Tab",
    "Navigation",
    '<div role="tablist" class="tabs tabs-box"><a role="tab" class="tab">Tab</a></div>',
  ],
  ["alert", "Alert", "Feedback", '<div class="alert alert-info">Info</div>'],
  [
    "loading",
    "Loading",
    "Feedback",
    '<span class="loading loading-spinner"></span>',
  ],
  [
    "progress",
    "Progress",
    "Feedback",
    '<progress class="progress progress-primary" value="40" max="100"></progress>',
  ],
  [
    "radial-progress",
    "Radial Progress",
    "Feedback",
    '<div class="radial-progress" style="--value:70">70%</div>',
  ],
  ["skeleton", "Skeleton", "Feedback", '<div class="skeleton h-8 w-32"></div>'],
  [
    "toast",
    "Toast",
    "Feedback",
    '<div class="toast"><div class="alert">Saved</div></div>',
  ],
  [
    "tooltip",
    "Tooltip",
    "Feedback",
    '<div class="tooltip" data-tip="Hint"><button class="btn">Hover</button></div>',
  ],
  [
    "checkbox",
    "Checkbox",
    "Data input",
    '<input type="checkbox" class="checkbox">',
  ],
  [
    "fieldset",
    "Fieldset",
    "Data input",
    '<fieldset class="fieldset"><legend class="fieldset-legend">Name</legend><input class="input"></fieldset>',
  ],
  [
    "file-input",
    "File Input",
    "Data input",
    '<input type="file" class="file-input">',
  ],
  [
    "filter",
    "Filter",
    "Data input",
    '<input class="btn filter-reset" type="radio" name="filter" aria-label="All">',
  ],
  ["input", "Input", "Data input", '<input class="input" placeholder="Name">'],
  ["label", "Label", "Data input", '<label class="label">Label</label>'],
  ["radio", "Radio", "Data input", '<input type="radio" class="radio">'],
  ["range", "Range", "Data input", '<input type="range" class="range">'],
  [
    "rating",
    "Rating",
    "Data input",
    '<div class="rating"><input type="radio" class="mask mask-star"></div>',
  ],
  [
    "select",
    "Select",
    "Data input",
    '<select class="select"><option>One</option></select>',
  ],
  [
    "textarea",
    "Textarea",
    "Data input",
    '<textarea class="textarea"></textarea>',
  ],
  ["toggle", "Toggle", "Data input", '<input type="checkbox" class="toggle">'],
  [
    "validator",
    "Validator",
    "Data input",
    '<input required class="input validator" type="email">',
  ],
  ["divider", "Divider", "Layout", '<div class="divider">OR</div>'],
  [
    "drawer",
    "Drawer",
    "Layout",
    '<div class="drawer"><input class="drawer-toggle" type="checkbox"></div>',
  ],
  [
    "footer",
    "Footer",
    "Layout",
    '<footer class="footer bg-base-200 p-4">Footer</footer>',
  ],
  [
    "hero",
    "Hero",
    "Layout",
    '<div class="hero bg-base-200"><div class="hero-content">Hero</div></div>',
  ],
  [
    "indicator",
    "Indicator",
    "Layout",
    '<div class="indicator"><span class="indicator-item badge">New</span><button class="btn">Inbox</button></div>',
  ],
  [
    "join",
    "Join",
    "Layout",
    '<div class="join"><button class="btn join-item">A</button><button class="btn join-item">B</button></div>',
  ],
  [
    "mask",
    "Mask",
    "Layout",
    '<div class="mask mask-squircle bg-primary p-8"></div>',
  ],
  [
    "stack",
    "Stack",
    "Layout",
    '<div class="stack"><div class="card bg-base-100 p-4">A</div></div>',
  ],
  [
    "browser",
    "Browser Mockup",
    "Mockup",
    '<div class="mockup-browser bg-base-300"><div class="mockup-browser-toolbar"></div></div>',
  ],
  [
    "code",
    "Code Mockup",
    "Mockup",
    '<div class="mockup-code"><pre><code>bun dev</code></pre></div>',
  ],
  [
    "phone",
    "Phone Mockup",
    "Mockup",
    '<div class="mockup-phone"><div class="display"><div class="artboard artboard-demo phone-1">App</div></div></div>',
  ],
  [
    "window",
    "Window Mockup",
    "Mockup",
    '<div class="mockup-window border bg-base-300"><div class="p-4 bg-base-200">Window</div></div>',
  ],
  [
    "color",
    "Color",
    "Data",
    '<div class="flex gap-2"><span class="badge badge-primary">primary</span><span class="badge badge-secondary">secondary</span></div>',
  ],
  ["glass", "Glass", "Layout", '<button class="btn glass">Glass</button>'],
  [
    "artboard",
    "Artboard",
    "Mockup",
    '<div class="artboard artboard-horizontal phone-1">Artboard</div>',
  ],
  [
    "responsive",
    "Responsive",
    "Layout",
    '<div class="grid grid-cols-2 gap-2 md:grid-cols-4"><div class="badge">A</div><div class="badge">B</div></div>',
  ],
  [
    "focus",
    "Focus",
    "Feedback",
    '<button class="btn focus-visible:outline-primary">Focusable</button>',
  ],
  [
    "empty-state",
    "Empty State",
    "Feedback",
    '<div class="rounded-box border border-dashed p-6 text-center">No records</div>',
  ],
] as const;

export const showroomComponents = names.map(([slug, name, group, example]) => ({
  slug,
  name,
  group,
  example,
})) satisfies ShowroomComponent[];

export function findShowroomComponent(slug: string) {
  return showroomComponents.find((component) => component.slug === slug);
}
