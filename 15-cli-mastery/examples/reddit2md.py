#!/usr/bin/env python3
import argparse
import sys
import requests


def format_reddit_json_url(url):
    if '.json' in url:
        return url
    query_idx = url.find('?')
    fragment_idx = url.find('#')
    insert_idx = len(url)
    if query_idx != -1:
        insert_idx = min(insert_idx, query_idx)
    if fragment_idx != -1:
        insert_idx = min(insert_idx, fragment_idx)
    base = url[:insert_idx].rstrip('/')
    remainder = url[insert_idx:]
    return f"{base}.json{remainder}"


def fetch_data(url):
    json_url = format_reddit_json_url(url)
    headers = {'User-Agent': 'reddit2md-cli/1.0'}
    response = requests.get(json_url, headers=headers, timeout=15)
    response.raise_for_status()
    data = response.json()
    if not (isinstance(data, list) and len(data) >= 2):
        raise ValueError("Unexpected Reddit API response structure")
    return data


def format_comment_text(text, escape_newlines):
    if escape_newlines:
        return text.replace('\r\n', ' ').replace('\n', ' ').replace('\r', ' ')
    return text


def render_comment(comment, style, escape_newlines, space_comments, output):
    data = comment.get('data', {})
    depth = data.get('depth', 0)
    body = data.get('body')
    author = data.get('author', '[deleted]')
    ups = data.get('ups', 0)
    downs = data.get('downs', 0)

    if style == 'tree':
        depth_tag = '─' * depth
        prefix = f"├{depth_tag} " if depth_tag else "##### "
    else:
        depth_tag = '\t' * depth
        prefix = f"{depth_tag}- "

    if body:
        text = format_comment_text(body, escape_newlines)
        output.append(f"{prefix}{text} ⏤ by *{author}* (↑ {ups}/ ↓ {downs})")
    else:
        output.append(f"{prefix}deleted")

    replies = data.get('replies')
    if replies and isinstance(replies, dict):
        children = replies.get('data', {}).get('children', [])
        for child in children:
            render_comment(child, style, escape_newlines, space_comments, output)

    if depth == 0 and replies:
        if style == 'tree':
            output.append('└────')
        if space_comments:
            output.append('')


def render(data, style, escape_newlines, space_comments):
    post = data[0]['data']['children'][0]['data']
    comments = data[1]['data']['children']

    output = []
    output.append(f"# {post['title']}")
    if post.get('selftext'):
        output.append(f"\n{post['selftext']}")
    output.append(f"\n[permalink](http://reddit.com{post['permalink']})")
    output.append(f"by *{post['author']}* (↑ {post['ups']}/ ↓ {post['downs']})")
    output.append('\n## Comments\n')

    for comment in comments:
        render_comment(comment, style, escape_newlines, space_comments, output)

    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(description='Convert Reddit post to markdown')
    parser.add_argument('url', help='Reddit post URL')
    parser.add_argument('--style', choices=['tree', 'list'], default='tree')
    parser.add_argument('--escape-newlines', action='store_true')
    parser.add_argument('--space-comments', action='store_true')
    parser.add_argument('--output', help='Output file (default: stdout)')
    args = parser.parse_args()

    data = fetch_data(args.url)
    result = render(data, args.style, args.escape_newlines, args.space_comments)

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(result)
    else:
        print(result)


if __name__ == '__main__':
    main()
