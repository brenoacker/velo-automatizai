import { expect, Page } from "@playwright/test";

export class OrderLookupPage {
    constructor(private page: Page) {}

    async expectOrderAriaSnapshotForOrderNotFound() {
        await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
        - img
        - heading "Pedido não encontrado" [level=3]
        - paragraph: Verifique o número do pedido e tente novamente
        `);
    }

    async expectOrderAriaSnapshot(order: {
            number: string;
            color: string;
            wheels: string;
            interior: string;
            customer: { name: string; email: string };
            payment: string;
        }) {
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
            await expect(this.page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(snapshot);
        }

    async searchOrder(orderNumber: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).click();
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber);
        await expect(this.page.getByRole('button', {name: 'Buscar Pedido'})).toBeVisible()
        await this.page.getByRole('button', {name: 'Buscar Pedido'}).click();
    }


    private static statusClassMap: Record<string, { badgeClass: RegExp; textClass: RegExp; iconClass: RegExp }> = {
        APROVADO: { badgeClass: /bg-green-100/, textClass: /text-green-700/, iconClass: /lucide-circle-check-big/ },
        EM_ANALISE: { badgeClass: /bg-yellow-100/, textClass: /text-yellow-700/, iconClass: /lucide-loader-circle/ },
        REPROVADO: { badgeClass: /bg-red-100/, textClass: /text-red-700/, iconClass: /lucide-circle-x/ },
    };

    async validateStatusBadge(status: string) {
        const { badgeClass, textClass } = OrderLookupPage.statusClassMap[status] || { badgeClass: /.*/, textClass: /.*/ };
        const statusBadge = this.page.getByRole('status').filter({ hasText: status });
        await expect(statusBadge).toHaveClass(badgeClass);
        await expect(statusBadge).toHaveClass(textClass);
        return statusBadge;
    }

    async validateStatusIcon(statusBadge: import('@playwright/test').Locator, status: string) {
        const { iconClass } = OrderLookupPage.statusClassMap[status] || { iconClass: /.*/ };
        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(iconClass);
    }
}
