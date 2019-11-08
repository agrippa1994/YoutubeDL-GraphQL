import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Info } from './info';
import { getInfo, Info as YTDLInfo } from 'youtube-dl';
import { Format } from './format';

@Resolver(of => Info)
export class AppResolver {
  @Query(returns => Info)
  async getInfo(@Args('url') url: string) {
    return (await this.getYoutubeInfo(url)) as Info;
  }

  @ResolveProperty()
  formats(
    @Parent() info: Info,
    @Args({ nullable: true, name: 'ext', type: () => String }) ext: string,
  ): Format[] {
    return (info.formats || []).filter(format => {
      if (ext === undefined) return true;
      return format.ext == ext;
    });
  }

  async getYoutubeInfo(...args: any[]): Promise<YTDLInfo> {
    return new Promise((resolve, reject) => {
      getInfo(...args, (error, info) => {
        if (error) return reject(error);
        if (info) return resolve(info);
      });
    });
  }
}
