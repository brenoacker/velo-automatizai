import { expect, Page, Locator } from '@playwright/test';

export type OrderDetails = {
  number: string;
    status: string
  color: string;
  wheels: string;
  interior: string;
  customer: { name: string; email: string };
    payment: string
};

export function createOrderLookupActions(page: Page) {
  const statusClassMap: Record<string, { badgeClass: RegExp; textClass: RegExp; iconClass: RegExp }> = {
    APROVADO: { badgeClass: /bg-green-100/, textClass: /text-green-700/, iconClass: /lucide-circle-check-big/ },
    EM_ANALISE: { badgeClass: /bg-yellow-100/, textClass: /text-yellow-700/, iconClass: /lucide-loader-circle/ },
    REPROVADO: { badgeClass: /bg-red-100/, textClass: /text-red-700/, iconClass: /lucide-circle-x/ },
  };

  const orderInput = page.getByRole('textbox', { name: 'Número do Pedido' });
  const searchButton = page.getByRole('button', { name: 'Buscar Pedido' });

  return {

    elements: {
        orderInput,
        searchButton,
    },

    async open() {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Velô Sprint', exact: true })).toBeVisible();

        await expect(page.getByRole('link', { name: 'Consultar Pedido' })).toBeVisible();
        await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        await expect(page.getByRole('textbox', { name: 'Número do Pedido' })).toBeVisible();
    },

    async searchOrder(orderNumber: string) {
      await orderInput.click();
      await orderInput.fill(orderNumber);
      await expect(searchButton).toBeVisible();
      await searchButton.click();
    },

    async expectOrderAriaSnapshotForOrderNotFound() {
      await expect(page.locator('#root')).toMatchAriaSnapshot(`
        - img
        - heading "Pedido não encontrado" [level=3]
        - paragraph: Verifique o número do pedido e tente novamente
      `);
    },

    async expectOrderAriaSnapshot(order: OrderDetails) {
      const snapshot = `
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: ${order.interior}
        - paragraph: Rodas
        - paragraph: ${order.wheels}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: ${order.customer.name}
        - paragraph: Email
        - paragraph: ${order.customer.email}
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: ${order.payment}
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `;
      await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(snapshot);
    },

    async validateStatusBadge(status: string) {
      const { badgeClass, textClass } = statusClassMap[status] || { badgeClass: /.*/, textClass: /.*/ };
      const statusBadge = page.getByRole('status').filter({ hasText: status });
        await expect(statusBadge).toHaveClass(badgeClass)
        await expect(statusBadge).toHaveClass(textClass)
      return statusBadge;
    },

    async validateStatusIcon(statusBadge: Locator, status: string) {
      const { iconClass } = statusClassMap[status] || { iconClass: /.*/ };
      const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(iconClass)
    },
  };
}
