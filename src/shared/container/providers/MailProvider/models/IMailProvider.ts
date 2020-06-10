export default interface IMailProvider {
  public sendMail(to: string, body: string): Promise<void>;
}
