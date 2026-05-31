export class GeraMensagem {
  log(tipo: string, mensagem: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${tipo}] ${mensagem}`);
  }

}
