import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApprovalService } from '../service';
import { Approval } from '../schema';

@Controller()
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Get(':account')
  async getApprovalsByAccount(
    @Param('account') account: string
  ): Promise<Approval[]> {
    return this.approvalService.findByAccount(account);
  }

  @Get('unique/contracts')
  async getUniqueContracts() {
    return this.approvalService.getUniqueContracts();
  }

  @Get('authz/:account')
  async getAuthzApprovals(
    @Param('account') account: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const perPage = limit > 0 ? limit : 20;
    const offset = page > 0 ? page * perPage : 0;

    return this.approvalService.findAuthzApprovals(account, offset, perPage);
  }

  @Get('gauthz/:account')
  async getGAuthzApprovals(
    @Param('account') account: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const perPage = limit > 0 ? limit : 20;
    const offset = page > 0 ? page * perPage : 0;

    return this.approvalService.findGAuthzApprovals(account, offset, perPage);
  }

  @Get('erc20/:account')
  async getERC20Approvals(
    @Param('account') account: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const perPage = limit > 0 ? limit : 20;
    const offset = page > 0 ? page * perPage : 0;

    return this.approvalService.findERC20Approvals(account, offset, perPage);
  }

  @Get('nft/:account')
  async getNftApprovals(
    @Param('account') account: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const perPage = limit > 0 ? limit : 20;
    const offset = page > 0 ? page * perPage : 0;

    return this.approvalService.findNftApprovals(account, offset, perPage);
  }
}
