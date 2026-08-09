import {
  Badge,
  Button,
  Codicon,
  ErrorState,
  PALETTE_AREA,
  ROUTES_AREA,
  SIDEBAR_NAV_AREA,
  STATUSBAR_AREAS,
  Tip,
  cn,
  haptic,
  host,
  useQuery,
  useValue,
} from '@hermes/plugin-sdk'
import { jsx, jsxs } from 'react/jsx-runtime'

const ID = 'nexus-control'
const ROUTE = '/nexus'

const PRIORITIES = [
  {
    label: 'Now',
    title: 'Pulled, Phase 2',
    detail: 'Replace morning portal rounds, then put verified results where the permit team already works.',
  },
  {
    label: 'Next',
    title: 'Pricing leverage',
    detail: 'Turn the pricing crawler output into a dependable category and unit lookup for estimates.',
  },
  {
    label: 'Guardrail',
    title: 'Close before opening',
    detail: 'Finish live operational loops before adding another build to the pile.',
  },
]

const QUICK_LINKS = [
  {
    label: 'Kanban',
    detail: 'Work already in motion',
    icon: 'project',
    open: () => host.navigate('/kanban'),
  },
  {
    label: 'Scheduled work',
    detail: 'Cron jobs and recurring agents',
    icon: 'clock',
    open: () => host.navigate('/cron'),
  },
  {
    label: 'Capabilities',
    detail: 'Skills, MCP, and tool surfaces',
    icon: 'tools',
    open: () => host.navigate('/skills'),
  },
  {
    label: 'Artifacts',
    detail: 'Outputs worth reviewing',
    icon: 'file-media',
    open: () => host.navigate('/artifacts'),
  },
  {
    label: 'Settings',
    detail: 'Native Hermes configuration',
    icon: 'settings-gear',
    open: () => host.navigate('/settings'),
  },
]

function compactPath(value) {
  if (!value) return 'No workspace selected'
  const normalized = String(value).replaceAll('\\', '/')
  const parts = normalized.split('/').filter(Boolean)
  if (parts.length <= 3) return normalized
  return `…/${parts.slice(-3).join('/')}`
}

function StateRow({ label, value, mono = false }) {
  return jsxs('div', {
    className: 'flex min-w-0 items-center justify-between gap-3 border-b border-(--ui-stroke-secondary) py-2 last:border-b-0',
    children: [
      jsx('span', {
        className: 'text-xs text-(--ui-text-tertiary)',
        children: label,
      }),
      jsx('span', {
        className: cn(
          'min-w-0 truncate text-right text-xs font-medium text-(--ui-text-primary)',
          mono && 'font-mono',
        ),
        title: String(value ?? ''),
        children: value || '—',
      }),
    ],
  })
}

function PriorityCard({ priority }) {
  return jsxs('article', {
    className: 'flex min-h-36 flex-col gap-3 rounded-lg border border-(--ui-stroke-secondary) p-4',
    children: [
      jsx(Badge, { children: priority.label }),
      jsx('h3', {
        className: 'text-sm font-semibold text-(--ui-text-primary)',
        children: priority.title,
      }),
      jsx('p', {
        className: 'text-xs leading-5 text-(--ui-text-tertiary)',
        children: priority.detail,
      }),
    ],
  })
}

function QuickLink({ item }) {
  return jsx(Button, {
    variant: 'ghost',
    className: 'h-auto w-full justify-start gap-3 rounded-lg border border-(--ui-stroke-secondary) p-3 text-left',
    onClick: () => {
      haptic('tap')
      item.open()
    },
    children: jsxs('span', {
      className: 'flex min-w-0 items-center gap-3',
      children: [
        jsx(Codicon, { name: item.icon, className: 'text-(--ui-accent)' }),
        jsxs('span', {
          className: 'min-w-0',
          children: [
            jsx('span', {
              className: 'block text-xs font-medium text-(--ui-text-primary)',
              children: item.label,
            }),
            jsx('span', {
              className: 'block truncate text-[0.6875rem] font-normal text-(--ui-text-tertiary)',
              children: item.detail,
            }),
          ],
        }),
      ],
    }),
  })
}

function RuntimeCard() {
  const gateway = useValue(host.state.gateway)
  const profile = useValue(host.state.profile)
  const model = useValue(host.state.model)
  const cwd = useValue(host.state.cwd)
  const activeSessionId = useValue(host.state.activeSessionId)
  const status = useQuery({
    queryKey: [ID, 'host-status'],
    queryFn: () => host.status(),
    refetchInterval: 15_000,
  })

  return jsxs('section', {
    className: 'rounded-lg border border-(--ui-stroke-secondary) p-4',
    children: [
      jsxs('div', {
        className: 'mb-2 flex items-center justify-between gap-3',
        children: [
          jsx('h2', {
            className: 'text-sm font-semibold text-(--ui-text-primary)',
            children: 'Hermes runtime',
          }),
          jsx(Badge, {
            children: status.isError ? 'unavailable' : status.isLoading ? 'checking' : 'observed',
          }),
        ],
      }),
      status.isError
        ? jsx(ErrorState, {
            title: 'Runtime status unavailable',
            description: 'NEXUS stays read-only. Open Hermes logs for the underlying error.',
          })
        : jsxs('div', {
            children: [
              jsx(StateRow, { label: 'Gateway', value: gateway }),
              jsx(StateRow, { label: 'Profile', value: profile }),
              jsx(StateRow, { label: 'Model', value: model }),
              jsx(StateRow, { label: 'Session', value: activeSessionId, mono: true }),
              jsx(StateRow, { label: 'Workspace', value: compactPath(cwd), mono: true }),
            ],
          }),
    ],
  })
}

function NexusPage() {
  return jsxs('main', {
    className: 'h-full overflow-auto',
    children: [
      jsxs('div', {
        className: 'mx-auto flex w-full max-w-6xl flex-col gap-6 p-5 md:p-7',
        children: [
          jsxs('header', {
            className: 'flex flex-col gap-2 border-b border-(--ui-stroke-secondary) pb-5',
            children: [
              jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  jsx(Codicon, { name: 'pulse', className: 'text-(--ui-accent)' }),
                  jsx('span', {
                    className: 'text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-(--ui-text-tertiary)',
                    children: 'DHC mission control',
                  }),
                ],
              }),
              jsx('h1', {
                className: 'text-2xl font-semibold tracking-tight text-(--ui-text-primary)',
                children: 'NEXUS',
              }),
              jsx('p', {
                className: 'max-w-3xl text-sm leading-6 text-(--ui-text-secondary)',
                children: 'A thin control plane over Hermes. NEXUS observes and organizes; Hermes executes.',
              }),
            ],
          }),
          jsxs('section', {
            className: 'grid gap-3 lg:grid-cols-3',
            children: PRIORITIES.map(priority => jsx(PriorityCard, { priority }, priority.title)),
          }),
          jsxs('section', {
            className: 'grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]',
            children: [
              jsxs('div', {
                className: 'rounded-lg border border-(--ui-stroke-secondary) p-4',
                children: [
                  jsx('h2', {
                    className: 'mb-3 text-sm font-semibold text-(--ui-text-primary)',
                    children: 'Native control surfaces',
                  }),
                  jsx('div', {
                    className: 'grid gap-2 sm:grid-cols-2',
                    children: QUICK_LINKS.map(item => jsx(QuickLink, { item }, item.label)),
                  }),
                ],
              }),
              jsx(RuntimeCard, {}),
            ],
          }),
          jsxs('aside', {
            className: 'flex items-start gap-3 rounded-lg border border-(--ui-stroke-secondary) p-4',
            children: [
              jsx(Codicon, { name: 'shield', className: 'mt-0.5 text-(--ui-accent)' }),
              jsxs('div', {
                className: 'space-y-1',
                children: [
                  jsx('div', {
                    className: 'text-xs font-semibold text-(--ui-text-primary)',
                    children: 'Authority stays with Hermes',
                  }),
                  jsx('p', {
                    className: 'text-xs leading-5 text-(--ui-text-tertiary)',
                    children: 'This page cannot run commands, change configuration, send messages, publish, or bypass approvals. Those actions remain in native Hermes surfaces.',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function NexusStatus() {
  const gateway = useValue(host.state.gateway)
  return jsx(Tip, {
    label: `NEXUS · gateway ${gateway}`,
    children: jsx('button', {
      type: 'button',
      className: 'inline-flex h-full items-center gap-1.5 px-1.5 text-[0.6875rem] text-(--ui-text-tertiary) hover:text-(--ui-text-primary)',
      onClick: () => {
        haptic('tap')
        host.navigate(ROUTE)
      },
      children: jsxs('span', {
        className: 'inline-flex items-center gap-1.5',
        children: [
          jsx(Codicon, { name: gateway === 'open' ? 'radio-tower' : 'circle-slash' }),
          jsx('span', { children: 'NEXUS' }),
        ],
      }),
    }),
  })
}

export default {
  id: ID,
  name: 'NEXUS Mission Control',
  register(ctx) {
    ctx.registerMany([
      {
        id: 'page',
        area: ROUTES_AREA,
        data: { path: ROUTE },
        render: () => jsx(NexusPage, {}),
      },
      {
        id: 'nav',
        area: SIDEBAR_NAV_AREA,
        data: { path: ROUTE, label: 'NEXUS', codicon: 'pulse' },
      },
      {
        id: 'open',
        area: PALETTE_AREA,
        data: {
          id: 'nexus.open',
          label: 'Open NEXUS Mission Control',
          keywords: ['nexus', 'mission', 'control', 'dhc'],
          run: () => host.navigate(ROUTE),
        },
      },
      {
        id: 'status',
        area: STATUSBAR_AREAS.right,
        order: 118,
        render: () => jsx(NexusStatus, {}),
      },
    ])
  },
}
