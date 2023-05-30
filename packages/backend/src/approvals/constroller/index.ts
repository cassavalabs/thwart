import { Controller, Get, Param } from '@nestjs/common';
import { ApprovalService } from '../service';
import { Approval } from '../schema';
import { AccountService } from 'src/accounts/service';

@Controller()
export class ApprovalController {
  constructor(
    private readonly approvalService: ApprovalService,
    private readonly accountService: AccountService,
  ) {}

  @Get(':account')
  async getApprovalsByAccount(
    @Param('account') account: string,
  ): Promise<Approval[]> {
    return this.approvalService.findByAccount(account);
  }

  @Get('unique/contracts')
  async getUniqueContracts() {
    return this.approvalService.getUniqueContracts();
  }

  @Get('test/route')
  async getTestRoutes() {
    return this.approvalService.getNullApprovedDates();
  }

  @Get('authz/:account')
  async getAuthzApprovals(
    @Param('account') account: string,
  ): Promise<Approval[]> {
    return this.approvalService.findAuthzApprovals(account);
  }

  @Get('gauthz/:account')
  async getGAuthzApprovals(
    @Param('account') account: string,
  ): Promise<Approval[]> {
    return this.approvalService.findGAuthzApprovals(account);
  }

  @Get('erc20/:account')
  async getERC20Approvals(@Param('account') account: string) {
    return this.approvalService.findERC20Approvals(account);
  }

  @Get('nft/:account')
  async getNftApprovals(
    @Param('account') account: string,
  ): Promise<Approval[]> {
    return this.approvalService.findNftApprovals(account);
  }
}
